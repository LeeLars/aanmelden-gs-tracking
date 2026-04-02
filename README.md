# Nieuwskrant Pipeline — Wat Moet Ik Doen?

## Kort antwoord

Je maakt **3 scheduled tasks** aan via claude.ai/code/scheduled.
Per task kopieer je de instructies uit het bijbehorende bestand.
Dat is het.

---

## Stap 0: Voorbereiding (eenmalig)

### Google Drive connector aanzetten
1. Ga naar **claude.ai** → **Settings** → **Connectors**
2. Zet **Google Drive** aan en koppel je Google Workspace account
3. Dit hoef je maar 1x te doen

### Lokale map aanmaken
Open een Claude Code chat en typ:
```
Maak deze mappen aan: ~/nieuwskrant/config en ~/nieuwskrant/werk
Maak dan het bestand ~/nieuwskrant/config/bronnen.json aan met de inhoud uit dit bestand: [plak de inhoud van config/bronnen.json]
```

Of doe het zelf via terminal:
```bash
mkdir -p ~/nieuwskrant/{config,werk}
```
En kopieer `config/bronnen.json` naar `~/nieuwskrant/config/bronnen.json`.

---

## Stap 1: Task 1 aanmaken — "Nieuwskrant Scan A"

1. Ga naar **claude.ai/code/scheduled**
2. Klik **New scheduled task**
3. Vul in:
   - **Name:** `Nieuwskrant Scan A`
   - **Schedule:** Dagelijks om **16:00** (jouw lokale tijd)
   - **Instructions:** Kopieer de VOLLEDIGE inhoud van `tasks/task1-scan-a.md`
4. Bij **Connectors:** zorg dat web search AAN staat, Google Drive mag UIT
5. Klik **Create**

---

## Stap 2: Task 2 aanmaken — "Nieuwskrant Scan B"

1. Klik **New scheduled task**
2. Vul in:
   - **Name:** `Nieuwskrant Scan B`
   - **Schedule:** Dagelijks om **16:20**
   - **Instructions:** Kopieer de VOLLEDIGE inhoud van `tasks/task2-scan-b.md`
3. Bij **Connectors:** web search AAN, Google Drive mag UIT
4. Klik **Create**

---

## Stap 3: Task 3 aanmaken — "Nieuwskrant Samenstellen"

1. Klik **New scheduled task**
2. Vul in:
   - **Name:** `Nieuwskrant Samenstellen`
   - **Schedule:** Dagelijks om **16:45**
   - **Instructions:** Kopieer de VOLLEDIGE inhoud van `tasks/task3-compile.md`
3. Bij **Connectors:** web search UIT, Google Drive AAN
4. Klik **Create**

---

## Testen

Na het aanmaken:
1. Klik op **"Nieuwskrant Scan A"** → **Run now**
2. Wacht tot hij klaar is, check of `~/nieuwskrant/werk/scan-a.json` bestaat
3. Doe hetzelfde voor **Scan B**
4. Als beide JSONs er staan: run **"Nieuwskrant Samenstellen"**
5. Check of de PDF op Google Drive staat in `Nieuwskrant/2026/04 - April/2026-04-02/`

---

## Mappenstructuur

### Lokaal (wordt elke dag opgeruimd door Task 3):
```
~/nieuwskrant/
├── config/bronnen.json    ← bronnenlijst, pas hier aan als je bronnen wilt wijzigen
└── werk/                  ← tijdelijk, wordt leeggemaakt na elke krant
```

### Google Drive (permanent archief):
```
Nieuwskrant/
└── 2026/
    └── 04 - April/
        ├── 2026-04-01/
        │   └── nieuwskrant-2026-04-01.pdf
        ├── 2026-04-02/
        │   └── nieuwskrant-2026-04-02.pdf
        └── ...
```

---

## Iets aanpassen?

- **Bron toevoegen/verwijderen:** Pas `~/nieuwskrant/config/bronnen.json` aan. De tasks lezen dit bestand elke keer opnieuw.
- **Land toevoegen:** Voeg het toe in bronnen.json EN in de juiste task-instructies.
- **Tijden wijzigen:** Ga naar claude.ai/code/scheduled, klik op de task, wijzig het schema.
- **Task loopt vast:** Splits verder op (bijv. 4 scan-tasks van 2-3 landen elk).
