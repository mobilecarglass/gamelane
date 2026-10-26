# GameLane

Modern responsive browser-game hub.  
Drop a single `.html` file into `/games` → it appears automatically.

## Automatic scanning on GitHub

Two workflows are included:

### 1. `scan-games.yml` (recommended for most hosts)
- Triggers whenever anything inside `games/` changes
- Runs the scanner
- Commits the updated `games.json` back to the repo
- Works with Netlify, Cloudflare Pages, Vercel, any static host

### 2. `scan-and-deploy.yml` (GitHub Pages)
- Scans + deploys the site to GitHub Pages in one go
- Enable Pages in repo Settings → Pages → Source: GitHub Actions

Just push a new game file. The Action does the rest.

## Adding a new game

1. Create `games/my-game.html`
2. Put this meta block at the very top of the file:

```html
<!--
  title: My Cool Game
  description: Short description for the card
  tags: arcade, puzzle
  thumbnail: data:image/svg+xml;base64,PHN2Zy...   ← optional Base64 data URI
-->
```

3. Commit & push

The GitHub Action will:
- detect the new file
- regenerate `games.json` (including any embedded thumbnail)
- commit it (or deploy)

**Tip:** Thumbnails are stored as Base64 data URIs *inside* each game HTML file.  
No separate `thumbs/` folder is needed. Adding or deleting a game only touches that one HTML file.

## Local development

```bash
node scan-games.js   # or npm run scan
npx serve .
```

## Project structure

```
/
├── index.html
├── games.json          ← auto-generated
├── scan-games.js
├── package.json
├── .github/workflows/
│   ├── scan-games.yml
│   └── scan-and-deploy.yml
└── games/
    └── *.html          ← each game is self-contained (thumbnail inside meta comment)
```
