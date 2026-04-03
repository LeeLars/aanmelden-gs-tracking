# Compilatie

Plak de scans samen tot de krant. Commit naar `main` in repo `LeeLars/aanmelden-gs-tracking`. GEEN nieuwe branch.

## Stap 1: Combineer via bash

Voer dit bash-commando uit (pas de datum aan):

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

cat werk/scan-1.md >> nieuwskrant-latest.md
echo "" >> nieuwskrant-latest.md
cat werk/scan-2.md >> nieuwskrant-latest.md
```

## Stap 2: Voeg "De Grote Lijnen" toe

Lees nieuwskrant-latest.md. Schrijf dan een sectie "De Grote Lijnen" en voeg die toe aan het einde van het bestand:

```
---

## 🌍 De Grote Lijnen

[4-6 zinnen. Welke thema's komen in meerdere landen terug? Welke ontwikkelingen hangen samen? Vooruitblik.]
```

Gebruik het Edit tool of echo/cat om dit toe te voegen — schrijf NIET het hele bestand opnieuw.

## Stap 3: Kopieer naar archief en commit

```bash
cp nieuwskrant-latest.md archief/$JAAR/$MAAND/nieuwskrant-$DATUM.md
git add nieuwskrant-latest.md archief/
git commit -m "nieuwskrant $DATUM"
```

## Stap 4: Opruimen

```bash
git rm werk/scan-1.md werk/scan-2.md
git commit -m "opruimen $DATUM"
git push origin main
```

## Stap 5: Telegram

Verstuur de krant als tekst naar Telegram. Telegram heeft een limiet van 4096 tekens per bericht, dus split het bestand op in stukken.

```bash
DATUM=$(date +%Y-%m-%d)
BOT="TELEGRAM_BOT_TOKEN"
CHAT="TELEGRAM_CHAT_ID"
API="https://api.telegram.org/bot$BOT/sendMessage"

# Split per land (op de '---' scheidingslijn) en verstuur elk deel apart
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
