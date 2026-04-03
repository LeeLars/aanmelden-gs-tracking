# Compilatie

Plak de scans samen tot de krant. Commit naar `main` in repo `LeeLars/aanmelden-gs-tracking`. GEEN nieuwe branch.

## Stap 1: Combineer via bash

Voer dit bash-commando uit (pas de datum aan):

```bash
DATUM=$(date +%Y-%m-%d)
DAG=$(LC_TIME=nl_NL.UTF-8 date +%A || date +%A)
MAAND=$(date +%m)
JAAR=$(date +%Y)

mkdir -p archief/$JAAR/$MAAND

# Header + scan-1 + scan-2 samenvoegen
cat > nieuwskrant-latest.md << 'HEADER'
# 📰 MIJN NIEUWSKRANT
HEADER

echo "### 📅 $DAG $DATUM" >> nieuwskrant-latest.md
echo "" >> nieuwskrant-latest.md
echo "---" >> nieuwskrant-latest.md
echo "" >> nieuwskrant-latest.md

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

```bash
curl -s -F "chat_id=TELEGRAM_CHAT_ID" \
  -F "document=@nieuwskrant-latest.md" \
  -F "caption=📰 Nieuwskrant $DATUM" \
  "https://api.telegram.org/botTELEGRAM_BOT_TOKEN/sendDocument"
```

Vervang TELEGRAM_BOT_TOKEN en TELEGRAM_CHAT_ID door de echte waarden in de scheduled task. NOOIT in Git.
