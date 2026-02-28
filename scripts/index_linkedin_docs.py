#!/usr/bin/env python3
"""Indexiert LinkedIn-Dokumente aus Google Drive und kategorisiert sie automatisch.

Workflow:
1) Liest Dateien aus einem konfigurierten Drive-Ordner.
2) Extrahiert Text (Google Docs + TXT; andere Typen mit Fallback-Metadaten).
3) Kategorisiert Inhalte regelbasiert und optional via LLM (OpenAI).
4) Schreibt/aktualisiert Datensätze in ein Google Sheet als "Datenbank".
"""

from __future__ import annotations

import argparse
import datetime as dt
import os
import re
from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple

from dotenv import load_dotenv
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

try:
    from openai import OpenAI
except Exception:  # optional dependency at runtime
    OpenAI = None

SCOPES = [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/spreadsheets",
]

CATEGORY_KEYWORDS: Dict[str, List[str]] = {
    "governance": ["governance", "steuerung", "verantwortung", "organisationsmodell"],
    "usecases": ["use case", "anwendungsfall", "pilot", "prototyp", "praxisbeispiel"],
    "regulierung": ["regulierung", "ai act", "dsgvo", "compliance", "recht"],
    "strategie": ["strategie", "roadmap", "zielbild", "transformation", "vision"],
    "daten": ["daten", "datenqualität", "datenplattform", "metadaten"],
    "change": ["change", "befähigung", "kompetenzen", "kultur", "schulung"],
}

SHEET_HEADER = [
    "file_id",
    "dateiname",
    "drive_link",
    "mime_type",
    "erstellt_am",
    "geaendert_am",
    "kategorien",
    "kategorie_grundlage",
    "inhalt_vorschau",
    "verarbeitet_am",
]


@dataclass
class DriveFile:
    file_id: str
    name: str
    mime_type: str
    created_time: str
    modified_time: str
    web_view_link: str


def get_credentials(client_secret_path: str, token_path: str) -> Credentials:
    creds: Optional[Credentials] = None
    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(client_secret_path, SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, "w", encoding="utf-8") as token:
            token.write(creds.to_json())

    return creds


def build_services(creds: Credentials):
    drive = build("drive", "v3", credentials=creds)
    sheets = build("sheets", "v4", credentials=creds)
    return drive, sheets


def list_drive_files(drive_service, folder_id: str) -> List[DriveFile]:
    query = f"'{folder_id}' in parents and trashed = false"
    fields = "nextPageToken, files(id,name,mimeType,createdTime,modifiedTime,webViewLink)"

    files: List[DriveFile] = []
    page_token = None

    while True:
        response = (
            drive_service.files()
            .list(
                q=query,
                spaces="drive",
                fields=fields,
                pageToken=page_token,
                pageSize=100,
                orderBy="modifiedTime desc",
            )
            .execute()
        )

        for file in response.get("files", []):
            files.append(
                DriveFile(
                    file_id=file["id"],
                    name=file["name"],
                    mime_type=file["mimeType"],
                    created_time=file.get("createdTime", ""),
                    modified_time=file.get("modifiedTime", ""),
                    web_view_link=file.get("webViewLink", ""),
                )
            )

        page_token = response.get("nextPageToken")
        if not page_token:
            break

    return files


def export_text(drive_service, file: DriveFile) -> str:
    try:
        if file.mime_type == "application/vnd.google-apps.document":
            content = (
                drive_service.files()
                .export(fileId=file.file_id, mimeType="text/plain")
                .execute()
                .decode("utf-8", errors="ignore")
            )
            return content

        if file.mime_type == "text/plain":
            content = drive_service.files().get_media(fileId=file.file_id).execute()
            return content.decode("utf-8", errors="ignore")

    except HttpError:
        return ""

    return ""


def normalize(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def keyword_categories(text: str) -> List[str]:
    norm = normalize(text)
    scores: Dict[str, int] = {}

    for category, keywords in CATEGORY_KEYWORDS.items():
        score = 0
        for kw in keywords:
            score += norm.count(kw)
        if score > 0:
            scores[category] = score

    if not scores:
        return ["sonstiges"]

    sorted_categories = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [c for c, _ in sorted_categories[:3]]


def llm_categories(text: str, allowed_categories: List[str], api_key: str) -> List[str]:
    if not OpenAI:
        return []

    client = OpenAI(api_key=api_key)
    prompt = (
        "Du bist ein Klassifikationssystem für LinkedIn-Posts zu KI in der Verwaltung. "
        "Wähle maximal 3 Kategorien aus dieser Liste: "
        f"{', '.join(allowed_categories)}. "
        "Gib nur ein JSON-Array zurück, z.B. [\"governance\",\"strategie\"]."
    )

    snippet = text[:6000]
    response = client.responses.create(
        model="gpt-4.1-mini",
        temperature=0,
        input=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": snippet},
        ],
    )

    raw = response.output_text.strip()
    values = re.findall(r'"([^"]+)"', raw)
    result = [v for v in values if v in allowed_categories]
    seen = set()
    deduped = []
    for item in result:
        if item not in seen:
            deduped.append(item)
            seen.add(item)
    return deduped[:3]


def ensure_header(sheets_service, spreadsheet_id: str, sheet_name: str):
    range_name = f"{sheet_name}!A1:J1"
    response = (
        sheets_service.spreadsheets()
        .values()
        .get(spreadsheetId=spreadsheet_id, range=range_name)
        .execute()
    )
    values = response.get("values", [])

    if not values:
        (
            sheets_service.spreadsheets()
            .values()
            .update(
                spreadsheetId=spreadsheet_id,
                range=range_name,
                valueInputOption="RAW",
                body={"values": [SHEET_HEADER]},
            )
            .execute()
        )


def existing_rows_by_file_id(sheets_service, spreadsheet_id: str, sheet_name: str) -> Dict[str, int]:
    range_name = f"{sheet_name}!A2:A"
    response = (
        sheets_service.spreadsheets()
        .values()
        .get(spreadsheetId=spreadsheet_id, range=range_name)
        .execute()
    )
    values = response.get("values", [])

    mapping = {}
    for idx, row in enumerate(values, start=2):
        if row and row[0]:
            mapping[row[0]] = idx
    return mapping


def upsert_row(
    sheets_service,
    spreadsheet_id: str,
    sheet_name: str,
    row_idx: Optional[int],
    row_values: List[str],
):
    if row_idx is None:
        range_name = f"{sheet_name}!A:J"
        (
            sheets_service.spreadsheets()
            .values()
            .append(
                spreadsheetId=spreadsheet_id,
                range=range_name,
                valueInputOption="RAW",
                insertDataOption="INSERT_ROWS",
                body={"values": [row_values]},
            )
            .execute()
        )
    else:
        range_name = f"{sheet_name}!A{row_idx}:J{row_idx}"
        (
            sheets_service.spreadsheets()
            .values()
            .update(
                spreadsheetId=spreadsheet_id,
                range=range_name,
                valueInputOption="RAW",
                body={"values": [row_values]},
            )
            .execute()
        )


def classify_document(text: str, use_llm: bool, api_key: Optional[str]) -> Tuple[List[str], str]:
    rule_based = keyword_categories(text)

    if use_llm and api_key:
        llm_based = llm_categories(text, list(CATEGORY_KEYWORDS.keys()) + ["sonstiges"], api_key)
        if llm_based:
            return llm_based, "llm"

    return rule_based, "regelbasiert"


def process_documents(
    drive_service,
    sheets_service,
    folder_id: str,
    spreadsheet_id: str,
    sheet_name: str,
    use_llm: bool,
    api_key: Optional[str],
):
    ensure_header(sheets_service, spreadsheet_id, sheet_name)
    existing = existing_rows_by_file_id(sheets_service, spreadsheet_id, sheet_name)

    files = list_drive_files(drive_service, folder_id)
    processed_at = dt.datetime.now(dt.timezone.utc).isoformat()

    for file in files:
        text = export_text(drive_service, file)
        searchable_text = f"{file.name}\n{text}" if text else file.name
        categories, source = classify_document(searchable_text, use_llm=use_llm, api_key=api_key)

        preview = normalize(text)[:250] if text else "(kein extrahierbarer Text)"

        row = [
            file.file_id,
            file.name,
            file.web_view_link,
            file.mime_type,
            file.created_time,
            file.modified_time,
            ", ".join(categories),
            source,
            preview,
            processed_at,
        ]

        upsert_row(
            sheets_service,
            spreadsheet_id,
            sheet_name,
            existing.get(file.file_id),
            row,
        )
        print(f"✓ Verarbeitet: {file.name} -> {', '.join(categories)} ({source})")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="LinkedIn-Dokumente in Google Drive klassifizieren")
    parser.add_argument("--folder-id", default=os.getenv("GOOGLE_DRIVE_FOLDER_ID"))
    parser.add_argument("--spreadsheet-id", default=os.getenv("GOOGLE_SHEET_ID"))
    parser.add_argument("--sheet-name", default=os.getenv("GOOGLE_SHEET_NAME", "LinkedInDB"))
    parser.add_argument("--client-secret", default=os.getenv("GOOGLE_CLIENT_SECRET", "client_secret.json"))
    parser.add_argument("--token-path", default=os.getenv("GOOGLE_TOKEN_PATH", "token.json"))
    parser.add_argument("--use-llm", action="store_true")
    return parser.parse_args()


def main():
    load_dotenv()
    args = parse_args()

    if not args.folder_id or not args.spreadsheet_id:
        raise SystemExit("Bitte GOOGLE_DRIVE_FOLDER_ID und GOOGLE_SHEET_ID setzen (oder via CLI übergeben).")

    api_key = os.getenv("OPENAI_API_KEY")
    creds = get_credentials(args.client_secret, args.token_path)
    drive_service, sheets_service = build_services(creds)

    process_documents(
        drive_service=drive_service,
        sheets_service=sheets_service,
        folder_id=args.folder_id,
        spreadsheet_id=args.spreadsheet_id,
        sheet_name=args.sheet_name,
        use_llm=args.use_llm,
        api_key=api_key,
    )


if __name__ == "__main__":
    main()
