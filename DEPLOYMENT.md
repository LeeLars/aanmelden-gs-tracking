# Deployment naar grafixstudio.io

## Stap 1: Server Setup (op je eigen server/VPS)

### Installeer de analytics server op je server

1. Upload alle bestanden naar je server
2. Installeer dependencies:
```bash
npm install
```

3. Start de server (gebruik PM2 voor productie):
```bash
npm install -g pm2
pm2 start server.js --name "analytics-server"
pm2 save
pm2 startup
```

4. Zorg dat de server bereikbaar is op een publieke URL, bijvoorbeeld:
   - `https://analytics.grafixstudio.io`
   - Of via een specifieke poort met reverse proxy

## Stap 2: Code kopiëren naar grafixstudio.io/template/kennismaken/

### HTML Code om toe te voegen

Voeg dit toe aan de `<head>` sectie van je pagina op grafixstudio.io:

```html
<!-- Analytics Tracking Configuration -->
<script>
    // Pas deze URL aan naar waar je analytics server draait
    window.ANALYTICS_API_URL = 'https://JE-SERVER-URL/api/track';
    // Bijvoorbeeld: window.ANALYTICS_API_URL = 'https://analytics.grafixstudio.io/api/track';
</script>
```

Voeg dit toe VOOR de `</body>` tag:

```html
<!-- Analytics Tracking Script -->
<script src="https://JE-SERVER-URL/tracking.js"></script>
<!-- Of upload tracking.js naar grafixstudio.io en gebruik: -->
<!-- <script src="/path/to/tracking.js"></script> -->
```

### Volledige HTML sectie voor de video + buttons

Kopieer deze code naar je pagina op grafixstudio.io:

```html
<!-- Video Header Section -->
<div class="video-header">
    <video id="heroVideo" playsinline loop>
        <source src="https://grafixstudio.io/wp-content/uploads/2026/02/Ad-02-sept.mp4" type="video/mp4">
        Je browser ondersteunt geen video.
    </video>
    
    <div class="video-overlay">
        <button id="playButton" class="play-button">
            <svg class="play-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            <svg class="pause-icon hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
        </button>
    </div>
    
    <div class="custom-controls">
        <button id="muteButton" class="control-btn">
            <svg class="sound-on" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            <svg class="sound-off hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
        </button>
        <div class="progress-bar">
            <div id="progress" class="progress-fill"></div>
        </div>
    </div>
</div>

<!-- CTA Buttons Section -->
<div class="cta-section">
    <h2>Hoe wil je contact?</h2>
    <div class="cta-buttons">
        <a href="https://wa.me/JOUW_NUMMER" class="cta-btn whatsapp-btn" id="whatsappBtn">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Stuur WhatsApp
        </a>
        
        <a href="tel:+31JOUWNUMMER" class="cta-btn phone-btn" id="phoneBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Bel me op
        </a>
        
        <a href="#registrationForm" class="cta-btn calendar-btn" id="calendarBtn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Plan afspraak
        </a>
    </div>
</div>
```

### CSS Code

Kopieer de volledige inhoud van `styles.css` naar je stylesheet op grafixstudio.io.

Of voeg een link toe in de `<head>`:
```html
<link rel="stylesheet" href="/path/to/styles.css">
```

### JavaScript Code

Kopieer de volledige inhoud van `script.js` naar je JavaScript bestand op grafixstudio.io.

Of voeg een script tag toe:
```html
<script src="/path/to/script.js"></script>
```

## Stap 3: Tracking Configuratie

### Optie A: Tracking.js hosten op je analytics server

Upload `tracking.js` naar je analytics server en verwijs ernaar:
```html
<script>
    window.ANALYTICS_API_URL = 'https://analytics.grafixstudio.io/api/track';
</script>
<script src="https://analytics.grafixstudio.io/tracking.js"></script>
```

### Optie B: Tracking.js hosten op grafixstudio.io

Upload `tracking.js` naar grafixstudio.io en voeg toe:
```html
<script>
    window.ANALYTICS_API_URL = 'https://analytics.grafixstudio.io/api/track';
</script>
<script src="/wp-content/themes/jouw-theme/js/tracking.js"></script>
```

## Stap 4: Dashboard Toegang

Het dashboard is beschikbaar op:
```
https://JE-ANALYTICS-SERVER-URL/dashboard.html
```

Je kunt ook het dashboard hosten op een aparte URL met wachtwoordbeveiliging.

## Server Requirements

### Minimale Server Specs
- Node.js 14+
- 512MB RAM
- 10GB opslag
- Publiek toegankelijke IP/domein

### Aanbevolen Setup
- VPS (DigitalOcean, Linode, etc.)
- Nginx als reverse proxy
- SSL certificaat (Let's Encrypt)
- PM2 voor process management

### Nginx Configuratie Voorbeeld

```nginx
server {
    listen 80;
    server_name analytics.grafixstudio.io;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Checklist voor Deployment

- [ ] Analytics server draait op publieke URL
- [ ] CORS is geconfigureerd voor grafixstudio.io
- [ ] `window.ANALYTICS_API_URL` is ingesteld in HTML
- [ ] tracking.js is toegevoegd aan de pagina
- [ ] Video HTML is gekopieerd
- [ ] CSS is gekopieerd/gelinkt
- [ ] JavaScript is gekopieerd/gelinkt
- [ ] WhatsApp en telefoon links zijn aangepast
- [ ] Dashboard is toegankelijk
- [ ] Test tracking door pagina te bezoeken
- [ ] Controleer dashboard voor data

## Testen

1. Open https://grafixstudio.io/template/kennismaken/
2. Open browser console (F12)
3. Check voor errors
4. Klik op buttons
5. Speel video af
6. Open dashboard en ververs
7. Controleer of data verschijnt

## Troubleshooting

### CORS Errors
Als je CORS errors ziet, voeg het exacte domein toe aan server.js:
```javascript
origin: ['https://grafixstudio.io', 'https://www.grafixstudio.io']
```

### Tracking werkt niet
- Check of `window.ANALYTICS_API_URL` correct is ingesteld
- Controleer of analytics server bereikbaar is
- Check browser console voor errors
- Verifieer dat tracking.js geladen wordt

### Dashboard toont geen data
- Bezoek eerst de website om data te genereren
- Check of API URL correct is
- Ververs dashboard
- Check server logs

## Support

Voor vragen, check:
- Browser console (F12)
- Server logs: `pm2 logs analytics-server`
- Network tab in browser developer tools
