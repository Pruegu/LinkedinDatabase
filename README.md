# LinkedinDatabase

Automatisierte Datenbank für deine LinkedIn-Dokumente (Themen: KI in der Verwaltung) mit Google Drive + Google Sheets.

## Was dieses Setup macht

- Liest alle Dateien aus einem bestimmten Google-Drive-Ordner.
- Extrahiert Text (Google Docs und `.txt`; andere Formate werden über Dateinamen klassifiziert).
- Vergibt automatisch Kategorien wie `governance`, `usecases`, `regulierung`, `strategie`.
- Schreibt alles in ein Google Sheet als laufend aktualisierte "Datenbank".
- Optional: nutzt ein LLM (OpenAI), um die Kategoriequalität zu verbessern.

## Zielstruktur der Datenbank (Google Sheet)

Das Script legt bzw. befüllt folgende Spalten:

1. `file_id`
2. `dateiname`
3. `drive_link`
4. `mime_type`
5. `erstellt_am`
6. `geaendert_am`
7. `kategorien`
8. `kategorie_grundlage` (`regelbasiert` oder `llm`)
9. `inhalt_vorschau`
10. `verarbeitet_am`

## Setup

### 1) Google Cloud vorbereiten

- Neues Projekt in der Google Cloud Console erstellen.
- APIs aktivieren:
  - Google Drive API
  - Google Sheets API
- OAuth Consent Screen einrichten.
- OAuth Client Credentials (Desktop App) erzeugen.
- JSON-Datei herunterladen und als `client_secret.json` im Projekt ablegen.

### 2) Python-Umgebung

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 3) Konfiguration

```bash
cp .env.example .env
```

Dann in `.env` setzen:

- `GOOGLE_DRIVE_FOLDER_ID`: ID deines LinkedIn-Dokument-Ordners
- `GOOGLE_SHEET_ID`: ID des Ziel-Google-Sheets
- `GOOGLE_SHEET_NAME`: Tabellenblatt-Name (Standard: `LinkedInDB`)
- `GOOGLE_CLIENT_SECRET`: Pfad zu OAuth JSON (Standard `client_secret.json`)
- `GOOGLE_TOKEN_PATH`: Token-Datei (Standard `token.json`)
- `OPENAI_API_KEY`: nur nötig, wenn `--use-llm` verwendet wird

## Ausführen

Regelbasiert:

```bash
python scripts/index_linkedin_docs.py
```

Mit LLM-Klassifikation:

```bash
python scripts/index_linkedin_docs.py --use-llm
```

Beim ersten Lauf öffnet sich ein Browser zur OAuth-Anmeldung.

## Automatisierung (täglich)

Beispiel mit `cron` (täglich 06:30):

```bash
30 6 * * * cd /workspace/LinkedinDatabase && /usr/bin/python3 scripts/index_linkedin_docs.py >> cron.log 2>&1
```

## Kategorien anpassen

Die Kategorien/Keywords kannst du in `CATEGORY_KEYWORDS` in `scripts/index_linkedin_docs.py` erweitern, z. B. für:

- `haushalt`
- `beschaffung`
- `sicherheit`
- `kommunen`

## Hinweise

- PDFs, PPTX, DOCX werden aktuell nur über Metadaten/Dateinamen eingeordnet, wenn kein Plaintext exportierbar ist.
- Für bessere Qualität bei komplexen Dokumenten `--use-llm` aktivieren.
- Für sehr große Volumen empfiehlt sich später ein inkrementeller Lauf mit Änderungsmarkern.
