# Scan Europa

Schrijf een nieuwsoverzicht voor 6 landen. Commit naar `main` in repo `LeeLars/aanmelden-gs-tracking`. GEEN nieuwe branch.

## Landen & bronnen

- 🇧🇪 België: standaard.be, tijd.be, vrt.be/vrtnws
- 🇳🇱 Nederland: nos.nl, nrc.nl, fd.nl
- 🇹🇷 Turkije: dailysabah.com, hurriyetdailynews.com, trtworld.com
- 🇷🇺 Rusland: themoscowtimes.com, meduza.io, tass.com
- 🇫🇷 Frankrijk: france24.com, lemonde.fr, lesechos.fr
- 🇩🇪 Duitsland: spiegel.de, handelsblatt.com, tagesschau.de

## Werkwijze

Zoek per land het nieuws van vandaag. Gebruik de bronnen hierboven — elk land alleen uit eigen media. Selecteer per land de **3 belangrijkste** items over politiek, economie, technologie of zakenleven. Geen sport/entertainment.

## HARDE REGELS — niet te overtreden

**A. Bronnen-rotatie:** De 3 items per land komen uit **3 VERSCHILLENDE bronnen**. Nooit dezelfde bron tweemaal in één land. Gebruik dus bv. voor België één item van standaard.be, één van tijd.be, één van vrt.be — niet 3× VRT.

**B. Datum-strikt:** Alleen artikelen van **vandaag of gisteren** (max 48 uur oud). Check de publicatiedatum op het artikel zelf, niet alleen op de homepage. Heeft een bron geen recent nieuws? Kies dan een ander artikel uit een andere bron — niet een ouder artikel van dezelfde bron.

**C. Anti-herhaling:** Lees vóór je begint `nieuwskrant-latest.md` uit de repo. Onderwerpen die daar al in stonden mag je **NIET herhalen**, ook niet met een nieuwe invalshoek of update. Kies altijd andere verhalen.

**D. Thema-diversificatie:** Per land moeten de 3 items over **3 verschillende onderwerpen** gaan — geen 3× energie, geen 3× politiek. Mix bv. binnenlandse politiek + bedrijfsnieuws + tech, of justitie + economie + sociale ontwikkeling.

**E. Max 1 megathema per land:** Als er een dominant wereldverhaal speelt (oorlog, crisis, beurscrash), dan **maximaal 1 item per land** daarover. De andere 2 items moeten over iets totaal anders gaan: een wetsvoorstel, een specifiek bedrijf, een arrestatie, een technologische doorbraak, een lokaal schandaal, een sociale trend.

**F. Diepere recherche:** Gebruik niet alleen de homepage van een bron — open expliciet de **politiek-, economie- of tech-secties**. Zoek liever verhalen die NIET op de internationale wires staan, dingen die alleen lokale media oppikken. Zoektermen zoals `site:lemonde.fr/economie` of `site:vrt.be/vrtnws/nl/regio`.

## Self-check vóór schrijven

Loop deze checklist door per land vóór je het bestand schrijft. Als één check faalt: zoek opnieuw voor dat land.

```
✓ Heb ik 3 items uit 3 VERSCHILLENDE bronnen?
✓ Gaan de 3 items over 3 VERSCHILLENDE onderwerpen?
✓ Zijn alle artikelen van vandaag of gisteren (max 48u)?
✓ Komt geen enkel onderwerp terug uit nieuwskrant-latest.md?
✓ Max 1 item per land over het dominante wereldthema?
```

## Bestand: `werk/scan-1.md`

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

Commit message: `scan-1 YYYY-MM-DD`
