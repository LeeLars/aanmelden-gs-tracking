# Nieuwskrant Pipeline

Dagelijks automatisch een nieuwskrant samenstellen via 3 Claude Code scheduled tasks.

## Hoe werkt het?

Alles draait via de **GitHub repo** — geen lokale bestanden of Google Drive nodig.

| Task | Tijd | Wat doet het? |
|------|------|---------------|
| Nieuwskrant Scan A | 16:00 | Scant nieuws voor België & Nederland → `werk/scan-a.json` |
| Nieuwskrant Scan B | 16:20 | Scant nieuws voor Frankrijk & Duitsland → `werk/scan-b.json` |
| Nieuwskrant Samenstellen | 16:45 | Combineert scans → `archief/` + `nieuwskrant-latest.md` |

## Setup

### 1. Scheduled tasks aanmaken

Ga naar **claude.ai** → **Code** → **Scheduled** → **New scheduled task**

Per task:
1. Koppel de repo `LeeLars/aanmelden-gs-tracking`
2. Zet de tijd in (zie tabel hierboven)
3. Kopieer de instructies uit het bijbehorende bestand in `tasks/`
4. Zet **"Allow unrestricted branch pushes"** AAN bij Permissions

| Task | Instructies uit |
|------|----------------|
| Nieuwskrant Scan A | `tasks/task1-scan-a.md` |
| Nieuwskrant Scan B | `tasks/task2-scan-b.md` |
| Nieuwskrant Samenstellen | `tasks/task3-compile.md` |

### 2. Testen

1. Klik op **Nieuwskrant Scan A** → **Run now**
2. Check of `werk/scan-a.json` in de repo verschijnt
3. Doe hetzelfde voor **Scan B**
4. Run **Nieuwskrant Samenstellen**
5. Check of de krant in `archief/` staat

## Mappenstructuur

```
aanmelden-gs-tracking/
├── config/bronnen.json        ← bronnenlijst (pas aan om bronnen te wijzigen)
├── tasks/                     ← instructies voor de scheduled tasks
│   ├── task1-scan-a.md
│   ├── task2-scan-b.md
│   └── task3-compile.md
├── werk/                      ← tijdelijk (wordt opgeruimd door task 3)
├── archief/                   ← permanent archief per jaar/maand
│   └── 2026/
│       └── 04/
│           ├── nieuwskrant-2026-04-01.md
│           └── nieuwskrant-2026-04-02.md
└── nieuwskrant-latest.md      ← altijd de meest recente krant
```

## Iets aanpassen?

- **Bron toevoegen/verwijderen:** Pas `config/bronnen.json` aan
- **Land toevoegen:** Voeg toe in `bronnen.json` EN in de juiste task-instructies
- **Tijden wijzigen:** Ga naar claude.ai → Code → Scheduled, wijzig het schema
