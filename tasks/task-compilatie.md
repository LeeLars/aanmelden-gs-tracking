# Compilatie

Plak de scans samen tot de krant. Commit naar `main` in repo `LeeLars/aanmelden-gs-tracking`. GEEN nieuwe branch.

## Stap 1: Combineer via bash

```bash
DATUM=$(date +%Y-%m-%d)
MAAND=$(date +%m)
JAAR=$(date +%Y)
DAGNR=$(date +%u)
case $DAGNR in 1)DAG=Maandag;;2)DAG=Dinsdag;;3)DAG=Woensdag;;4)DAG=Donderdag;;5)DAG=Vrijdag;;6)DAG=Zaterdag;;7)DAG=Zondag;;esac
DAY=$(date +%-d)
MAANDNR=$(date +%-m)
case $MAANDNR in 1)MND=januari;;2)MND=februari;;3)MND=maart;;4)MND=april;;5)MND=mei;;6)MND=juni;;7)MND=juli;;8)MND=augustus;;9)MND=september;;10)MND=oktober;;11)MND=november;;12)MND=december;;esac

mkdir -p archief/$JAAR/$MAAND

cat > nieuwskrant-latest.md << EOF
# 📰 MIJN NIEUWSKRANT
### 📅 $DAG $DAY $MND $JAAR

---

EOF

# Voeg scan-1 toe als die bestaat, anders een melding
if [ -f werk/scan-1.md ]; then
  cat werk/scan-1.md >> nieuwskrant-latest.md
else
  echo "> ⚠️ Scan Europa was niet beschikbaar." >> nieuwskrant-latest.md
fi

echo "" >> nieuwskrant-latest.md

# Voeg scan-2 toe als die bestaat, anders een melding
if [ -f werk/scan-2.md ]; then
  cat werk/scan-2.md >> nieuwskrant-latest.md
else
  echo "> ⚠️ Scan Wereld was niet beschikbaar." >> nieuwskrant-latest.md
fi
```

## Stap 2: Voeg marktoverzicht toe

Zoek actuele koersen op via web search (BTC, ETH, Goud, Brent olie, EUR/USD, S&P 500, AEX, DAX, Nikkei). Voeg de tabel toe met echo/cat:

```
---

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

## Stap 3: Voeg "De Grote Lijnen" toe

Voeg toe aan het einde:

```
---

## 🌍 De Grote Lijnen

[4-6 zinnen. Rode draden, dwarsverbanden, vooruitblik.]
```

Schrijf NIET het hele bestand opnieuw — gebruik echo/cat.

## Stap 4: Kopieer naar archief en commit

```bash
cp nieuwskrant-latest.md archief/$JAAR/$MAAND/nieuwskrant-$DATUM.md
git add nieuwskrant-latest.md archief/
git commit -m "nieuwskrant $DATUM"
```

## Stap 5: Opruimen

```bash
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
  curl -s -X POST "$API" \
    -d "chat_id=$CHAT" \
    -d "parse_mode=Markdown" \
    --data-urlencode "text=$TEXT" > /dev/null
  sleep 1
done

rm -f /tmp/nk_*.txt
```

Vervang TELEGRAM_BOT_TOKEN en TELEGRAM_CHAT_ID door de echte waarden in de scheduled task. NOOIT in Git.
