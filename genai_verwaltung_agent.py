#!/usr/bin/env python3
"""Wöchentlicher Research-Agent für GenAI-Use-Cases in der Verwaltung.

- Sucht über Google-News-RSS mit vordefinierten Queries
- Extrahiert und dedupliziert Treffer
- Scoret Treffer heuristisch
- Schreibt Kandidaten-CSV und Weekly-Briefing (Markdown)
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import html
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from typing import Iterable

DATE_FMT = "%Y-%m-%d"


QUERIES = {
    "ch": [
        '"Generative AI" public administration Switzerland',
        '"GenAI" canton municipality Switzerland',
        'Verwaltung GenAI Pilotprojekt Schweiz',
        'Künstliche Intelligenz Behörde Chatbot Schweiz',
    ],
    "eu": [
        '"LLM" government pilot Europe',
        '"AI assistant" public sector procurement Europe',
        'Generative AI ministry Europe public sector',
    ],
    "global": [
        '"generative AI" government case study',
        'public sector AI assistant rollout',
    ],
}


@dataclass
class Candidate:
    region: str
    title: str
    institution: str
    country: str
    use_case_summary: str
    status: str
    source_primary: str
    source_secondary: str
    published_date: str
    score_concrete: int
    score_maturity: int
    score_transferability: int
    score_source_quality: int
    score_recency: int
    total_score: int
    notes: str


def google_news_rss(query: str, when_days: int = 7, lang: str = "de", country: str = "CH") -> str:
    q = f"{query} when:{when_days}d"
    encoded = urllib.parse.quote_plus(q)
    return (
        f"https://news.google.com/rss/search?q={encoded}&hl={lang}&gl={country}&ceid={country}:{lang}"
    )


def fetch(url: str, timeout: int = 20) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", errors="replace")


def parse_rss(xml_text: str) -> list[dict[str, str]]:
    root = ET.fromstring(xml_text)
    items = []
    for item in root.findall("./channel/item"):
        title = (item.findtext("title") or "").strip()
        link = (item.findtext("link") or "").strip()
        pub_date = (item.findtext("pubDate") or "").strip()
        desc = html.unescape((item.findtext("description") or "").strip())
        items.append({"title": title, "link": link, "pubDate": pub_date, "description": desc})
    return items


def normalize_date(pub_date: str) -> str:
    try:
        parsed = dt.datetime.strptime(pub_date, "%a, %d %b %Y %H:%M:%S %Z")
        return parsed.date().strftime(DATE_FMT)
    except ValueError:
        return dt.date.today().strftime(DATE_FMT)


def extract_country(title: str, description: str, region: str) -> str:
    text = f"{title} {description}".lower()
    if region == "ch":
        return "Schweiz"
    hints = {
        "Deutschland": ["deutschland", "germany", "bundes"],
        "Frankreich": ["france", "frankreich"],
        "UK": ["uk", "united kingdom", "britain"],
        "EU": ["eu", "european commission", "european union"],
    }
    for c, kws in hints.items():
        if any(kw in text for kw in kws):
            return c
    return "Unbekannt"


def infer_status(text: str) -> str:
    t = text.lower()
    if any(k in t for k in ["pilot", "piloting", "prototype", "test"]):
        return "Pilot"
    if any(k in t for k in ["rollout", "launched", "introduces", "deployed"]):
        return "Rollout"
    if any(k in t for k in ["production", "in use", "live"]):
        return "Produktiv"
    return "Unbekannt"


def score_candidate(title: str, desc: str, published_date: str, link: str) -> tuple[int, int, int, int, int]:
    text = f"{title} {desc}".lower()
    concrete = min(5, sum(int(k in text) for k in ["ministry", "city", "canton", "municipality", "agency", "verwaltung"]))
    maturity = 5 if "production" in text or "live" in text else 3 if "pilot" in text else 1
    transferability = 4 if any(k in text for k in ["document", "assistant", "chatbot", "procurement"]) else 2
    source_quality = 4 if any(d in link for d in [".gov", ".admin.ch", ".europa.eu"]) else 2
    days_old = (dt.date.today() - dt.datetime.strptime(published_date, DATE_FMT).date()).days
    recency = 5 if days_old <= 7 else 3 if days_old <= 30 else 1
    return concrete, maturity, transferability, source_quality, recency


def dedupe(items: Iterable[Candidate]) -> list[Candidate]:
    seen: set[tuple[str, str]] = set()
    out: list[Candidate] = []
    for c in items:
        key = (re.sub(r"\W+", "", c.title.lower())[:80], c.country)
        if key in seen:
            continue
        seen.add(key)
        out.append(c)
    return out


def write_csv(candidates: list[Candidate], path: str) -> None:
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(Candidate.__annotations__.keys())
        for c in candidates:
            writer.writerow(c.__dict__.values())


def build_markdown(candidates: list[Candidate], start: str, end: str) -> str:
    def section(region_key: str, label: str) -> str:
        rows = [c for c in candidates if c.region == region_key and c.total_score >= 15]
        if not rows:
            return f"## {label}\nKeine qualifizierten Treffer in diesem Zeitraum.\n"
        lines = [f"## {label}"]
        for c in rows[:8]:
            lines += [
                f"- **Titel:** {c.title}",
                f"  - **Behörde/Institution:** {c.institution}",
                f"  - **Land/Region:** {c.country}",
                f"  - **Use-Case in 1 Satz:** {c.use_case_summary}",
                f"  - **Status:** {c.status}",
                f"  - **Quellen:** [{c.source_primary}]({c.source_primary})",
                f"  - **Veröffentlichungsdatum:** {c.published_date}",
                "",
            ]
        return "\n".join(lines)

    total = len([c for c in candidates if c.total_score >= 15])
    md = [
        "# Weekly Briefing – GenAI in der Verwaltung",
        f"**Berichtszeitraum:** {start} bis {end}",
        f"**Erstellt am:** {dt.date.today().strftime(DATE_FMT)}",
        "",
        "## 1) Executive Summary",
        f"- Qualifizierte Use-Cases (Score >= 15): **{total}**",
        "- Fokus: Schweiz, Europa, weltweite Benchmarks.",
        "- Bitte menschlich validieren, bevor Entscheidungen getroffen werden.",
        "",
        section("ch", "2) Top Use-Cases Schweiz"),
        section("eu", "3) Top Use-Cases Europa"),
        section("global", "4) Top Use-Cases weltweit (Benchmark)"),
        "## 5) Quellenverzeichnis",
    ]
    for c in candidates[:40]:
        md.append(f"- {c.source_primary}")
    return "\n".join(md)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--days", type=int, default=7)
    parser.add_argument("--out-md", default="weekly_briefing_genai_verwaltung.md")
    parser.add_argument("--out-csv", default="weekly_candidates_genai_verwaltung.csv")
    args = parser.parse_args()

    end = dt.date.today()
    start = end - dt.timedelta(days=args.days)
    candidates: list[Candidate] = []

    for region, queries in QUERIES.items():
        for q in queries:
            try:
                xml_data = fetch(google_news_rss(q, when_days=args.days))
                for hit in parse_rss(xml_data)[:10]:
                    published = normalize_date(hit["pubDate"])
                    title = hit["title"]
                    desc = re.sub("<[^>]+>", "", hit["description"])
                    country = extract_country(title, desc, region)
                    status = infer_status(f"{title} {desc}")
                    sc = score_candidate(title, desc, published, hit["link"])
                    total = sum(sc)
                    candidates.append(
                        Candidate(
                            region=region,
                            title=title,
                            institution="Unbekannt (manuell ergänzen)",
                            country=country,
                            use_case_summary=desc[:220] if desc else "Kurzbeschreibung manuell ergänzen",
                            status=status,
                            source_primary=hit["link"],
                            source_secondary="",
                            published_date=published,
                            score_concrete=sc[0],
                            score_maturity=sc[1],
                            score_transferability=sc[2],
                            score_source_quality=sc[3],
                            score_recency=sc[4],
                            total_score=total,
                            notes="Automatisch gesammelt; manuelle Prüfung erforderlich",
                        )
                    )
            except Exception as exc:
                print(f"Warnung bei Query '{q}': {exc}", file=sys.stderr)

    deduped = dedupe(candidates)
    write_csv(deduped, args.out_csv)
    with open(args.out_md, "w", encoding="utf-8") as f:
        f.write(build_markdown(deduped, start.strftime(DATE_FMT), end.strftime(DATE_FMT)))

    print(f"Erstellt: {args.out_md}, {args.out_csv} (Kandidaten: {len(deduped)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
