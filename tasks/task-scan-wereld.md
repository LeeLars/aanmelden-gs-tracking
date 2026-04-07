# Scan Wereld

Schrijf een nieuwsoverzicht voor 5 landen + marktdata. Commit naar `main` in repo `LeeLars/aanmelden-gs-tracking`. GEEN nieuwe branch.

## Landen & bronnen

- 🇬🇧 VK: bbc.co.uk/news, ft.com, theguardian.com
- 🇺🇸 VS: apnews.com, nytimes.com, bloomberg.com
- 🇮🇳 India: thehindu.com, economictimes.indiatimes.com, ndtv.com
- 🇨🇳 China: scmp.com, globaltimes.cn, caixinglobal.com
- 🇯🇵 Japan: japantimes.co.jp, asia.nikkei.com, www3.nhk.or.jp/nhkworld

## Werkwijze

Zoek per land het nieuws van vandaag. Gebruik de bronnen hierboven — elk land alleen uit eigen media. Selecteer per land de **3 belangrijkste** items over politiek, economie, technologie of zakenleven. Geen sport/entertainment.

## HARDE REGELS — niet te overtreden

**A. Bronnen-rotatie:** De 3 items per land komen uit **3 VERSCHILLENDE bronnen**. Nooit dezelfde bron tweemaal in één land. Bv. voor de VS één item van apnews.com, één van nytimes.com, één van bloomberg.com — niet 3× dezelfde.

**B. Datum-strikt:** Alleen artikelen van **vandaag of gisteren** (max 48 uur oud). Check de publicatiedatum op het artikel zelf, niet alleen op de homepage. Heeft een bron geen recent nieuws? Kies dan een ander artikel uit een andere bron — niet een ouder artikel van dezelfde bron.

**C. Anti-herhaling:** Lees vóór je begint `nieuwskrant-latest.md` uit de repo. Onderwerpen die daar al in stonden mag je **NIET herhalen**, ook niet met een nieuwe invalshoek of update. Kies altijd andere verhalen.

**D. Thema-diversificatie:** Per land moeten de 3 items over **3 verschillende onderwerpen** gaan, maar **uitsluitend binnen de categorieën politiek, economie/zakelijk en technologie**. Geen 3× tarieven, geen 3× verkiezingen. Ideale mix: 1 politiek + 1 economie/zakelijk + 1 technologie. Of als er één categorie weinig nieuws heeft: 2 verschillende verhalen uit één categorie + 1 uit een andere.

**E. Max 1 megathema per land:** Als er een dominant wereldverhaal speelt (oorlog, crisis, beurscrash), dan **maximaal 1 item per land** daarover. De andere 2 items moeten ook in politiek/economie/tech zitten, maar over iets anders: een wetsvoorstel, een specifiek bedrijf, een arrestatie van een politicus, een technologische doorbraak, een fusie, een nieuw beleid. **Geen** sport, lifestyle, entertainment, human interest, sociale trends, gezondheid, cultuur.

**F. Diepere recherche:** Gebruik niet alleen de homepage van een bron — open expliciet de **politiek-, economie- of tech-secties**. Zoek liever verhalen die NIET op de internationale wires staan, dingen die alleen lokale media oppikken. Zoektermen zoals `site:scmp.com/business` of `site:thehindu.com/business`.

## Self-check vóór schrijven

Loop deze checklist door per land vóór je het bestand schrijft. Als één check faalt: zoek opnieuw voor dat land.

```
✓ Heb ik 3 items uit 3 VERSCHILLENDE bronnen?
✓ Gaan de 3 items over 3 VERSCHILLENDE onderwerpen?
✓ Zijn alle artikelen van vandaag of gisteren (max 48u)?
✓ Komt geen enkel onderwerp terug uit nieuwskrant-latest.md?
✓ Max 1 item per land over het dominante wereldthema?
```

## Bestand: `werk/scan-2.md`

Schrijf per land exact dit:

```
## [emoji] [Land]

**[Rode draad — 1 zin]**

- **[Kop]**
  [3-4 zinnen. Wat is er besloten/gebeurd? Door wie? Welke cijfers en bedragen? Wat is de achtergrond/context? Wat zijn de gevolgen of reacties? **Vetgedrukt** voor namen, cijfers en organisaties.]
  📰 Bron — datum 🔗 [url]

- **[Kop]**
  [3-4 zinnen met achtergrond en context.]
  📰 Bron — datum 🔗 [url]

- **[Kop]**
  [3-4 zinnen met achtergrond en context.]
  📰 Bron — datum 🔗 [url]

---
```

## Marktdata

Zoek actuele koersen en voeg toe aan het einde:

```
## 📊 Marktoverzicht

| Markt | Koers | % |
|-------|-------|---|
| BTC | $XX.XXX | +X,X% |
| ETH | $X.XXX | +X,X% |
| Goud | $X.XXX | +X,X% |
| Brent olie | $XXX | +X,X% |
| EUR/USD | X,XX | +X,X% |
| S&P 500 | X.XXX | +X,X% |
| AEX | XXX | +X,X% |
| DAX | XX.XXX | +X,X% |
| Nikkei | XX.XXX | +X,X% |
```

Commit message: `scan-2 YYYY-MM-DD`
