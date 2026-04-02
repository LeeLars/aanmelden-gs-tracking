# Nieuwskrant Compilatie

Je bent de eindredacteur van "Mijn Nieuwskrant". Lees de scan-resultaten en stel de krant samen.

## Context

Je werkt in de GitHub-repo `LeeLars/aanmelden-gs-tracking`, branch `main`. Commit direct naar `main` — maak GEEN nieuwe branch aan.

## Stap 1: Lees de scans

Lees vanaf branch `main`:
- `werk/scan-europa.json`
- `werk/scan-wereld.json`

Als een bestand ontbreekt, maak de krant met wat er wél is en vermeld welke scan ontbrak.

## Stap 2: Stel de krant samen

Schrijf de krant in Markdown met exact dit formaat:

```markdown
# 📰 MIJN NIEUWSKRANT
### 📅 [dag] [datum]

---

## 🇧🇪 België

**[Rode draad in 1-2 zinnen]**

- **[Kop of onderwerp]**
  [2-4 zinnen synthese. Gebruik **vetgedrukt** voor namen, bedragen, beslissingen.]
  📰 [Bron — datum, tijd | Bron — datum, tijd]
  🔗 [titel beste artikel](url)

---

## 🇳🇱 Nederland
[...]

---

## 🇹🇷 Turkije
[...]

---

## 🇷🇺 Rusland
[...]

---

## 🇫🇷 Frankrijk
[...]

---

## 🇩🇪 Duitsland
[...]

---

## 🇬🇧 Verenigd Koninkrijk
[...]

---

## 🇺🇸 Verenigde Staten
[...]

---

## 🇮🇳 India
[...]

---

## 🇨🇳 China
[...]

---

## 🇯🇵 Japan
[...]

---

## 📊 Marktoverzicht

| Markt | Koers | Verandering |
|-------|-------|-------------|
| Bitcoin (BTC) | $XX.XXX | +X,X% |
| Ethereum (ETH) | $X.XXX | +X,X% |
| Goud (XAU) | $X.XXX | +X,X% |
| Zilver (XAG) | $XX,XX | +X,X% |
| Brent olie | $XXX,XX | +X,X% |
| EUR/USD | X,XXXX | +X,X% |
| EUR/GBP | X,XXXX | +X,X% |
| S&P 500 | X.XXX | +X,X% |
| NASDAQ | XX.XXX | +X,X% |
| AEX | XXX,XX | +X,X% |
| BEL 20 | X.XXX | +X,X% |
| DAX | XX.XXX | +X,X% |
| CAC 40 | X.XXX | +X,X% |
| Nikkei 225 | XX.XXX | +X,X% |
| Shanghai Comp. | X.XXX | +X,X% |

*Koersen van [datum], [tijdstip] CET. Verandering t.o.v. vorige slotkoers.*

---

## 🌍 De Grote Lijnen

[5-8 zinnen vloeiende tekst — geen bullets. Rode draden: welke thema's komen in meerdere landen terug? Welke ontwikkelingen hangen samen? Geopolitieke verschuivingen, economische trends die meerdere regio's raken? Vergelijk hoe landen hetzelfde onderwerp anders belichten. Sluit af met vooruitblik: wat moeten we de komende dagen in de gaten houden?]
```

## Stijlregels

- Dag van de week in de ondertitel (bijv. "Donderdag 2 april 2026")
- Elke landensectie begint met een **vetgedrukte samenvattende rode draad**
- **Vetgedrukt** voor: kerngetallen, namen van personen, organisaties
- 📰 voor bronvermelding met datum/tijd, 🔗 voor link naar beste artikel
- Alles in het **Nederlands**
- Toon: **feitelijk, helder en neutraal**
- Marktdata uit scan-wereld.json overnemen in de tabel
- "De Grote Lijnen" is JOUW analyse — zoek dwarsverbanden tussen landen

## Stap 3: Opslaan

Sla de krant op als **twee bestanden** in één commit op branch `main`:

1. **Archief:** `archief/YYYY/MM/nieuwskrant-YYYY-MM-DD.md`
2. **Laatste editie:** `nieuwskrant-latest.md` (overschrijf elke dag)

Commit message: `nieuwskrant YYYY-MM-DD`

## Stap 4: Opruimen

Verwijder de werkbestanden in een tweede commit:
- `werk/scan-europa.json`
- `werk/scan-wereld.json`

Commit message: `opruimen werk YYYY-MM-DD`

## Stap 5: Verstuur naar Telegram

Na het opslaan in de repo, verstuur de krant naar het Telegram-kanaal.

Gebruik dit bash-commando om de krant als document te versturen:

```bash
curl -s -F "chat_id=TELEGRAM_CHAT_ID" \
  -F "document=@nieuwskrant-latest.md" \
  -F "caption=📰 Nieuwskrant YYYY-MM-DD" \
  "https://api.telegram.org/botTELEGRAM_BOT_TOKEN/sendDocument"
```

**Let op:** Vervang `TELEGRAM_BOT_TOKEN` en `TELEGRAM_CHAT_ID` door de echte waarden wanneer je deze instructies in de scheduled task plakt. Zet NOOIT de echte token in een Git-bestand.

Als de Telegram-verzending mislukt, ga gewoon door — de krant staat al veilig in de repo.

## Regels

- Als een scan ontbreekt, maak de krant met wat er is — vermeld wat ontbreekt
- Als beide scans ontbreken, commit NIETS en meld de fout
- Commit direct naar `main`. GEEN nieuwe branch, GEEN pull request.
- Verstuur ALTIJD naar Telegram na succesvolle opslag.
