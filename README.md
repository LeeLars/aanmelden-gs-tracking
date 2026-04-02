# Nieuwskrant

Dagelijks automatisch een persoonlijke nieuwskrant samenstellen via 3 Claude Code scheduled tasks.

## Hoe werkt het?

Drie tasks draaien dagelijks en communiceren via `main`:

| Task | Tijd | Wat | Output |
|------|------|-----|--------|
| Scan Europa | 16:00 | BE, NL, TR, RU, FR, DE | `werk/scan-europa.json` |
| Scan Wereld | 16:00 | UK, US, IN, CN, JP + marktdata | `werk/scan-wereld.json` |
| Compilatie | 16:30 | Combineert scans tot krant | `nieuwskrant-latest.md` + archief |

Per land: synthese van meerdere lokale bronnen (cross-referentie, geen copy-paste).
Marktoverzicht: BTC, ETH, goud, zilver, olie, valuta, beurzen.
Afsluiter: "De Grote Lijnen" met rode draden en dwarsverbanden.

## Repostructuur

```
.gitignore
README.md
config/
  bronnen.json                ← bronnen per land + marktdata-items
tasks/
  task-scan-europa.md         ← instructies scan Europa
  task-scan-wereld.md         ← instructies scan Wereld + marktdata
  task-compilatie.md          ← instructies compilatie krant
werk/                         ← tijdelijk, wordt opgeruimd door compilatie
archief/
  YYYY/
    MM/
      nieuwskrant-YYYY-MM-DD.md
nieuwskrant-latest.md         ← altijd de meest recente krant
```

## Setup

Per task op **claude.ai → Code → Scheduled → New scheduled task**:

1. Koppel repo `LeeLars/aanmelden-gs-tracking`
2. Kopieer instructies uit het bijbehorende bestand in `tasks/` (via Raw op GitHub)
3. Stel de tijd in (zie tabel)
4. Bij **Permissions**: zet "Allow unrestricted branch pushes" AAN

## Aanpassen

- **Bronnen wijzigen:** Pas `config/bronnen.json` aan
- **Landen toevoegen:** Voeg toe in `bronnen.json` en in de juiste scan-task
- **Tijden wijzigen:** Pas aan op claude.ai → Code → Scheduled
