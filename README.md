# LinkedinDatabase

## GenAI-Verwaltungs-Agent (weekly)

Dieses Repo enthält jetzt einen ausführbaren Agenten, der wöchentlich konkrete GenAI-Use-Cases für die öffentliche Verwaltung sammelt:

- Script: `genai_verwaltung_agent.py`
- Blueprint: `agent_genai_verwaltung_weekly.md`
- CSV-Schema: `candidate_tracking_template.csv`

### Ausführen

```bash
python3 genai_verwaltung_agent.py --days 7
```

### Output

- `weekly_briefing_genai_verwaltung.md` (berichtsfertiger Weekly-Report)
- `weekly_candidates_genai_verwaltung.csv` (Kandidatenliste mit Scores)

### Hinweise

- Die Recherche basiert auf Google-News-RSS-Suchergebnissen und braucht manuelle Qualitätsprüfung.
- Der Agent dedupliziert Treffer und bewertet sie heuristisch.
