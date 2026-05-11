Combineer scans tot krant. Commit naar main in repo LeeLars/aanmelden-gs-tracking. GEEN nieuwe branch.

## Stap 1: Check of beide scans klaar zijn

Kijk of werk/scan-1.md en werk/scan-2.md bestaan in de repo. Als er een ontbreekt, wacht 5 minuten en check opnieuw (max 3 keer). Als na 15 minuten nog steeds een scan ontbreekt, ga door met wat er is.

## Stap 2: Combineer via bash

```bash
DATUM=$(date +%Y-%m-%d)
DAGNR=$(date +%u)
case $DAGNR in 1)DAG=Maandag;;2)DAG=Dinsdag;;3)DAG=Woensdag;;4)DAG=Donderdag;;5)DAG=Vrijdag;;6)DAG=Zaterdag;;7)DAG=Zondag;;esac
DAY=$(date +%-d)
MAANDNR=$(date +%-m)
case $MAANDNR in 1)MND=januari;;2)MND=februari;;3)MND=maart;;4)MND=april;;5)MND=mei;;6)MND=juni;;7)MND=juli;;8)MND=augustus;;9)MND=september;;10)MND=oktober;;11)MND=november;;12)MND=december;;esac
MAAND=$(date +%m)
JAAR=$(date +%Y)
mkdir -p archief/$JAAR/$MAAND

cat > nieuwskrant-latest.md << EOF
# MIJN NIEUWSKRANT
### $DAG $DAY $MND $JAAR
---
EOF

if [ -f werk/scan-1.md ]; then cat werk/scan-1.md >> nieuwskrant-latest.md; else echo "> Scan Europa niet beschikbaar." >> nieuwskrant-latest.md; fi
echo "" >> nieuwskrant-latest.md
if [ -f werk/scan-2.md ]; then cat werk/scan-2.md >> nieuwskrant-latest.md; else echo "> Scan Wereld niet beschikbaar." >> nieuwskrant-latest.md; fi
```

## Stap 3: Marktoverzicht

Zoek koersen op (BTC, ETH, Goud, Brent, EUR/USD, S&P500, AEX, DAX, Nikkei) en voeg toe aan nieuwskrant-latest.md.

## Stap 4: De Grote Lijnen

Voeg 4-6 zinnen toe over rode draden en dwarsverbanden tussen de landen.

## Stap 5: Opslaan en opruimen

```bash
cp nieuwskrant-latest.md archief/$JAAR/$MAAND/nieuwskrant-$DATUM.md
git add nieuwskrant-latest.md archief/
git commit -m "nieuwskrant $DATUM"
git rm --ignore-unmatch werk/scan-1.md werk/scan-2.md
git commit --allow-empty -m "opruimen $DATUM"
git push origin main
```

## Stap 6: Telegram

```bash
DATUM=$(date +%Y-%m-%d)
BOT="TELEGRAM_BOT_TOKEN"
CHAT="TELEGRAM_CHAT_ID"
API="https://api.telegram.org/bot$BOT/sendMessage"
csplit -z nieuwskrant-latest.md '/^---$/' '{*}' -f /tmp/nk_ -b '%02d.txt' 2>/dev/null
for f in /tmp/nk_*.txt; do
  TEXT=$(cat "$f" | head -c 4090)
  [ -z "$(echo "$TEXT" | tr -d '[:space:]')" ] && continue
  curl -s -X POST "$API" -d "chat_id=$CHAT" -d "parse_mode=Markdown" --data-urlencode "text=$TEXT" > /dev/null
  sleep 1
done
rm -f /tmp/nk_*.txt
```

Vervang TELEGRAM_BOT_TOKEN en TELEGRAM_CHAT_ID door de echte waarden. NOOIT in Git.
