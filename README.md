# Nieuwskrant

Dagelijks automatisch een nieuwskrant samenstellen via een Claude Code scheduled task.

## Hoe werkt het?

Eén scheduled task draait dagelijks om 16:00. Die:
1. Scant het nieuws voor 11 landen (BE, NL, TR, RU, FR, DE, UK, US, IN, CN, JP) via web search
2. Synthetiseert per land 3-5 items op basis van meerdere lokale bronnen
3. Voegt een marktoverzicht toe (BTC, goud, olie, beurzen, valuta)
4. Sluit af met "De Grote Lijnen" — rode draden en dwarsverbanden
5. Slaat op in het archief en overschrijft `nieuwskrant-latest.md`

## Repostructuur

```
.gitignore
README.md
config/
  bronnen.json              ← nieuwsbronnen per land
tasks/
  task-nieuwskrant.md       ← instructies voor de scheduled task
archief/
  2026/
    04/
      nieuwskrant-2026-04-02.md
      nieuwskrant-2026-04-03.md
      ...
nieuwskrant-latest.md       ← altijd de meest recente krant
```

## Setup

1. Ga naar **claude.ai** → **Code** → **Scheduled** → **New scheduled task**
2. Koppel de repo `LeeLars/aanmelden-gs-tracking`
3. Kopieer de inhoud van `tasks/task-nieuwskrant.md` als instructies
4. Zet schedule op **Daily** om **16:00**
5. Bij **Permissions**: zet "Allow unrestricted branch pushes" AAN

## Aanpassen

- **Bronnen wijzigen:** Pas `config/bronnen.json` aan
- **Tijd wijzigen:** Ga naar claude.ai → Code → Scheduled, pas het schema aan
- **Landen toevoegen:** Voeg toe in `config/bronnen.json` en update `tasks/task-nieuwskrant.md`
