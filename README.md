# GameLane

Modern responsive browser-game hub.  
Drop a single `.html` file into `/games` → it appears automatically.

## Thumbnails (embedded)

Thumbnails live **inside** each game HTML file — no separate image folder.

At the top of every game:

```html
<!--
  title: My Game
  description: Short description
  tags: arcade, puzzle
  thumbnail: data:image/svg+xml;base64,....
-->
```

The scanner reads this block and writes `games.json`. The homepage uses the data URI directly.

## GitHub auto-scan

On push, GitHub Actions runs `node scan-games.js` and deploys. New games appear automatically.

## Adding a game

1. Create `games/my-game.html` (self-contained, with the meta block above)
2. Commit & push

## Local

```bash
node scan-games.js
npx serve .
```
