# Compilatie

Combineer de scans tot de definitieve krant. Commit naar `main` in repo `LeeLars/aanmelden-gs-tracking`. GEEN nieuwe branch.

## Stap 1: Lees

Lees van branch `main`:
- `werk/scan-1.md`
- `werk/scan-2.md`

Als een bestand ontbreekt, maak de krant met wat er is.

## Stap 2: Combineer

Maak dit bestand:

```
# 📰 MIJN NIEUWSKRANT
### 📅 [dag] [datum]

---

[inhoud scan-1.md]

[inhoud scan-2.md]

---

## 🌍 De Grote Lijnen

[4-6 zinnen. Welke thema's komen in meerdere landen terug? Welke ontwikkelingen hangen samen? Vooruitblik: wat moeten we de komende dagen in de gaten houden?]
```

## Stap 3: Opslaan

Twee bestanden in één commit:
1. `archief/YYYY/MM/nieuwskrant-YYYY-MM-DD.md`
2. `nieuwskrant-latest.md`

Commit: `nieuwskrant YYYY-MM-DD`

## Stap 4: Opruimen

Verwijder `werk/scan-1.md` en `werk/scan-2.md`.
Commit: `opruimen YYYY-MM-DD`

## Stap 5: Telegram

```bash
curl -s -F "chat_id=TELEGRAM_CHAT_ID" \
  -F "document=@nieuwskrant-latest.md" \
  -F "caption=📰 Nieuwskrant YYYY-MM-DD" \
  "https://api.telegram.org/botTELEGRAM_BOT_TOKEN/sendDocument"
```

Vervang TELEGRAM_BOT_TOKEN en TELEGRAM_CHAT_ID door de echte waarden in de scheduled task. NOOIT in Git.
