# Analytics Tracking System - Aanmelden GS

Complete tracking en analytics systeem voor de Aanmelden GS website met lokaal dashboard.

## Wat wordt getrackt

### Bezoeker Data
- Unieke sessie ID
- Timestamp van bezoek
- Locatie (met toestemming via browser)
- Device informatie (browser, OS, schermgrootte)
- Referrer (waar bezoeker vandaan komt)
- Tijd op pagina
- Scroll diepte

### Video Metrics
- Play/Pause/Ended events
- Totale kijktijd per sessie
- Gemiddelde kijktijd over alle bezoekers
- Percentage van video bekeken
- Mute/unmute events

### Button Clicks
- WhatsApp button clicks
- Telefoon button clicks
- Afspraak button clicks
- Timestamps van alle clicks

### Formulier Data
- Naam, email, telefoon
- Timestamp van inzending
- Gekoppeld aan sessie

## Installatie

### 1. Installeer Node.js Dependencies

```bash
cd "/Users/larsleenders/Downloads/Aanmelden GS"
npm install
```

Dit installeert:
- express (web server)
- sqlite3 (database)
- cors (cross-origin requests)

### 2. Start de Analytics Server

```bash
npm start
```

Of:

```bash
node server.js
```

De server draait op: **http://localhost:3000**

Je ziet in de terminal:
```
Connected to SQLite database
Database tables initialized
Analytics server running on http://localhost:3000
Dashboard available at http://localhost:3000/dashboard.html
```

### 3. Open de Website

Open in je browser:
```
http://localhost:3000/index.html
```

De tracking begint automatisch zodra de pagina laadt.

### 4. Bekijk het Dashboard

Open in je browser:
```
http://localhost:3000/dashboard.html
```

## Dashboard Features

### Overzicht Kaarten
- **Totaal Bezoekers**: Aantal unieke sessies
- **Gemiddelde Video Kijktijd**: Hoe lang mensen gemiddeld kijken
- **Totaal Clicks**: Som van alle button clicks
- **Formulier Inzendingen**: Aantal ingevulde formulieren
- **Gemiddelde Tijd op Pagina**: Hoe lang mensen blijven
- **Conversie Rate**: Percentage bezoekers dat formulier invult

### Grafieken
- **Button Clicks Verdeling**: Bar chart met clicks per button type
- **Video Engagement**: Statistieken over video interacties

### Sessies Tabel
- Alle bezoekers met details
- Zoekfunctie
- Filters (met locatie, met clicks, met formulier)
- Sorteerbaar

### Clicks Timeline
- Overzicht van clicks per dag
- Visuele weergave per button type

### Export
- Download alle data als CSV
- Klik op "Export CSV" button

## Database

Alle data wordt opgeslagen in:
```
/Users/larsleenders/Downloads/Aanmelden GS/data/analytics.db
```

Dit is een SQLite database met 4 tabellen:
- `sessions` - Bezoeker sessies
- `video_events` - Video interacties
- `button_clicks` - Button clicks
- `form_submissions` - Formulier inzendingen

## Privacy

- **Locatie**: Alleen met expliciete toestemming via browser popup
- **Geen cookies**: Gebruikt sessionStorage voor sessie ID
- **Lokaal**: Alle data blijft op je eigen server
- **Geen externe services**: Geen tracking van derden

## API Endpoints

De server biedt de volgende endpoints:

### Tracking
- `POST /api/track/session` - Nieuwe sessie registreren
- `POST /api/track/video` - Video event tracken
- `POST /api/track/click` - Button click tracken
- `POST /api/track/form` - Formulier inzending tracken
- `PUT /api/track/session/:id` - Sessie updaten (tijd/scroll)

### Analytics
- `GET /api/analytics/overview` - Overzicht statistieken
- `GET /api/analytics/sessions` - Alle sessies
- `GET /api/analytics/video-stats` - Video statistieken
- `GET /api/analytics/clicks-timeline` - Clicks per dag
- `GET /api/analytics/export` - Export als CSV

## Bestanden Overzicht

```
/Aanmelden GS/
├── index.html          # Hoofdpagina (aangepast met tracking)
├── styles.css          # Styling
├── script.js           # Originele functionaliteit
├── tracking.js         # ✨ Tracking code (NIEUW)
├── server.js           # ✨ Node.js backend (NIEUW)
├── package.json        # ✨ Dependencies (NIEUW)
├── dashboard.html      # ✨ Analytics dashboard (NIEUW)
├── dashboard.css       # ✨ Dashboard styling (NIEUW)
├── dashboard.js        # ✨ Dashboard functionaliteit (NIEUW)
├── README.md           # ✨ Deze instructies (NIEUW)
└── data/
    └── analytics.db    # ✨ SQLite database (automatisch aangemaakt)
```

## Troubleshooting

### Server start niet
- Controleer of Node.js geïnstalleerd is: `node --version`
- Controleer of poort 3000 vrij is
- Installeer dependencies opnieuw: `npm install`

### Tracking werkt niet
- Controleer of server draait
- Open browser console (F12) voor errors
- Controleer of tracking.js geladen is

### Dashboard toont geen data
- Controleer of server draait op http://localhost:3000
- Bezoek eerst index.html om data te genereren
- Ververs dashboard met de "Ververs Data" button

### Locatie werkt niet
- Browser vraagt om toestemming - accepteer de popup
- HTTPS is soms vereist (localhost werkt altijd)
- Sommige browsers blokkeren locatie in incognito mode

## Auto-refresh

Het dashboard ververst automatisch elke 30 seconden.
Je kunt ook handmatig verversen met de "Ververs Data" button.

## Productie Deployment

Voor productie gebruik:
1. Wijzig `http://localhost:3000` naar je productie URL in:
   - `tracking.js` (regel 4)
   - `dashboard.js` (regel 3)
2. Gebruik een process manager zoals PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "analytics-server"
   pm2 save
   ```
3. Configureer reverse proxy (nginx/apache) indien nodig

## Support

Voor vragen of problemen, check de browser console en server logs.
