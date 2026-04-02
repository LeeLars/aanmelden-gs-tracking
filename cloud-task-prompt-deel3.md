# Cloud Task: Nieuwskrant Deel 3 — Azië + Samenvoegen
# Planning: 08:00 (Belgische tijd) | Frequentie: Dagelijks
# Naam in scheduler: "Nieuwskrant Deel 3 — Azië + Samenvoegen"

---

## PROMPT (kopieer alles hieronder naar de scheduler):

Je bent mijn persoonlijke nieuwsanalist. Maak DEEL 3 van mijn nieuwskrant en voeg daarna alles samen tot de definitieve krant.

## Stap 1: Haal het nieuwste op en lees de eerdere delen

Voer `git pull` uit zodat je de bestanden van deel 1 en deel 2 hebt.

Lees EERST deze bestanden uit de root van de repository:
- "nieuwskrant-deel1-[vandaag's datum YYYY-MM-DD].md"
- "nieuwskrant-deel2-[vandaag's datum YYYY-MM-DD].md"

Als een bestand niet bestaat, sla dat deel dan over in de samenvoeging.

## Stap 2: Schrijf de Azië-landen

🇮🇳 India — bronnen: thehindu.com, economictimes.indiatimes.com, ndtv.com, livemint.com
🇨🇳 China — bronnen: scmp.com, caixinglobal.com, globaltimes.cn, english.news.cn, asia.nikkei.com
🇯🇵 Japan — bronnen: japantimes.co.jp, www3.nhk.or.jp/nhkworld, asia.nikkei.com, english.kyodonews.net, mainichi.jp/english

### Werkwijze per land

1. Zoek breed: "[land] nieuws vandaag politiek economie"
2. Zoek 2-3 belangrijkste bronnen apart op via web search
3. Vergelijk wat meerdere bronnen schrijven over dezelfde onderwerpen
4. Schrijf per land 3-5 nieuwsitems als SYNTHESE van meerdere bronnen

### Regels

- ALLEEN politiek, economisch en zakelijk nieuws — GEEN sport, entertainment, lifestyle
- Elk land wordt UITSLUITEND samengevat op basis van bronnen UIT DAT LAND ZELF
- Per item: 2-4 zinnen synthese met context en achtergrond
- **Vetgedrukt** voor belangrijke namen, bedragen, beslissingen
- Alles in het Nederlands

### Zoekstrategie

- 2 brede zoekopdrachten per land
- 1-2 gerichte zoekopdrachten voor belangrijke verhalen
- Fetch maximaal 2-3 artikelen per land
- Totaal: ~4-5 zoekopdrachten per land, ~12-15 voor 3 landen

## Stap 3: Schrijf "De Grote Lijnen"

Lees de inhoud van deel 1, deel 2 en je eigen Azië-deel. Schrijf dan:

🌍 De Grote Lijnen — 5-8 zinnen vloeiende tekst (geen bullets):
- Welke thema's komen in meerdere landen terug?
- Welke ontwikkelingen hangen samen?
- Hoe belichten verschillende landen hetzelfde onderwerp?
- Vooruitblik: wat moeten we de komende dagen in de gaten houden?

## Stap 4: Voeg alles samen en sla op

Combineer deel 1 + deel 2 + Azië-landen + De Grote Lijnen tot één definitief bestand.

Sla op als `nieuwskrant-[YYYY-MM-DD].md` in de root van de repository.

Gebruik dit formaat:

---

# 📰 MIJN NIEUWSKRANT
### 📅 [dag] [datum]

---

## 🇧🇪 België
[kopieer uit deel 1]

---

## 🇳🇱 Nederland
[kopieer uit deel 1]

---

## 🇫🇷 Frankrijk
[kopieer uit deel 1]

---

## 🇩🇪 Duitsland
[kopieer uit deel 1]

---

## 🇬🇧 Verenigd Koninkrijk
[kopieer uit deel 2]

---

## 🇺🇸 Verenigde Staten
[kopieer uit deel 2]

---

## 🇹🇷 Turkije
[kopieer uit deel 2]

---

## 🇷🇺 Rusland
[kopieer uit deel 2]

---

## 🇮🇳 India
[nieuw geschreven]

---

## 🇨🇳 China
[nieuw geschreven]

---

## 🇯🇵 Japan
[nieuw geschreven]

---

## 🌍 De Grote Lijnen
[nieuw geschreven synthese]

---

## Stap 5: Opruimen, committen en pushen

1. Verwijder `nieuwskrant-deel1-[YYYY-MM-DD].md` en `nieuwskrant-deel2-[YYYY-MM-DD].md`
2. Commit alle wijzigingen met message: `chore: nieuwskrant compleet - [YYYY-MM-DD]`
3. Push naar de huidige branch.
