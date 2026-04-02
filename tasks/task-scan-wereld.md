# Nieuwskrant Scan Wereld

Je bent een nieuwsanalist. Scan het nieuws voor 5 niet-Europese landen, verzamel marktdata, en sla de resultaten op als JSON.

## Context

Je werkt in de GitHub-repo `LeeLars/aanmelden-gs-tracking`, branch `main`. Commit direct naar `main` — maak GEEN nieuwe branch aan.

## Landen

Lees `config/bronnen.json` voor de bronnenlijst. Scan deze landen:
- 🇬🇧 Verenigd Koninkrijk
- 🇺🇸 Verenigde Staten
- 🇮🇳 India
- 🇨🇳 China
- 🇯🇵 Japan

## Werkwijze per land

### 1. ALLE bronnen raadplegen
Doorzoek voor elk land ELKE bron uit bronnen.json. Niet één krant pakken en klaar.

Zoekstrategie:
- Zoek breed: "[land] news today"
- Zoek per bron: "site:scmp.com", "site:nytimes.com", "site:thehindu.com" etc.
- Fetch homepages van bronnen voor topverhalen

### 2. Cross-referentie
- Wat komt in MEERDERE kranten terug? → Belangrijkst
- Wat staat alleen in één krant maar is relevant? → Kan ook waardevol zijn
- Opvallende verschillen in framing?

### 3. Selectie
Per land **3-5 items**. ALLEEN politiek, economie, zakelijk nieuws. GEEN sport, entertainment, lifestyle.

## BRONREGEL — CRUCIAAL

Elk land UITSLUITEND op basis van media UIT DAT LAND ZELF.
- 🇨🇳 China-nieuws ALLEEN uit SCMP, Caixin, Global Times, Xinhua, Nikkei Asia — NIET uit BBC/NYT
- 🇮🇳 India-nieuws ALLEEN uit The Hindu, Economic Times, NDTV, Livemint — NIET uit The Guardian
- Dit geldt voor ALLE landen

## Marktdata

Zoek de actuele koersen op via web search en voeg toe aan de output:

```json
"marktdata": {
  "tijdstip": "HH:MM CET",
  "koersen": [
    { "naam": "Bitcoin (BTC)", "koers": "$XX.XXX", "verandering": "+X,X%" },
    { "naam": "Ethereum (ETH)", "koers": "$X.XXX", "verandering": "+X,X%" },
    { "naam": "Goud (XAU)", "koers": "$X.XXX", "verandering": "+X,X%" },
    { "naam": "Zilver (XAG)", "koers": "$XX,XX", "verandering": "+X,X%" },
    { "naam": "Brent olie", "koers": "$XXX,XX", "verandering": "+X,X%" },
    { "naam": "EUR/USD", "koers": "X,XXXX", "verandering": "+X,X%" },
    { "naam": "EUR/GBP", "koers": "X,XXXX", "verandering": "+X,X%" },
    { "naam": "S&P 500", "koers": "X.XXX", "verandering": "+X,X%" },
    { "naam": "NASDAQ", "koers": "XX.XXX", "verandering": "+X,X%" },
    { "naam": "AEX", "koers": "XXX,XX", "verandering": "+X,X%" },
    { "naam": "BEL 20", "koers": "X.XXX", "verandering": "+X,X%" },
    { "naam": "DAX", "koers": "XX.XXX", "verandering": "+X,X%" },
    { "naam": "CAC 40", "koers": "X.XXX", "verandering": "+X,X%" },
    { "naam": "Nikkei 225", "koers": "XX.XXX", "verandering": "+X,X%" },
    { "naam": "Shanghai Comp.", "koers": "X.XXX", "verandering": "+X,X%" }
  ]
}
```

## Output

Sla op als `werk/scan-wereld.json` op branch `main` met dit formaat:

```json
{
  "scan": "wereld",
  "datum": "YYYY-MM-DD",
  "tijdstip": "HH:MM",
  "landen": {
    "vk": {
      "naam": "Verenigd Koninkrijk",
      "emoji": "🇬🇧",
      "samenvatting": "Rode draad in 1-2 zinnen.",
      "berichten": [
        {
          "titel": "Kop of onderwerp",
          "tekst": "2-4 zinnen SYNTHESE op basis van meerdere bronnen. Vermeld **concrete cijfers**, **namen**, **datums**.",
          "bronnen": "BBC News — 2 apr, 10:30 | The Guardian — 2 apr, 09:15",
          "url": "https://beste-artikel-url"
        }
      ]
    },
    "vs": { "..." : "..." },
    "india": { "..." : "..." },
    "china": { "..." : "..." },
    "japan": { "..." : "..." }
  },
  "marktdata": { "..." : "..." }
}
```

Commit message: `scan-wereld YYYY-MM-DD`

## Regels

- Schrijf ALLE tekst in het **Nederlands**
- Vermeld altijd **concrete cijfers**, **namen** en **datums**
- Vermeld bij elke bron de **exacte URL** — geen verzonnen links
- Als je een URL niet kunt verifiëren, gebruik de homepage van de bron
- Schrijf feitelijk en neutraal
- Overschrijf het bestand als het al bestaat
- Commit direct naar `main`. GEEN nieuwe branch.
