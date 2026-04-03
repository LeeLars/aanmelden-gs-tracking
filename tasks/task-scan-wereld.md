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
