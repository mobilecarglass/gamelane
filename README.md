# GameLane

Drop a single `.html` file into `/games` → push → it appears on the site.

## How auto-add works

1. Put `games/my-game.html` (with meta comment at the top)
2. `git add` + `git push`
3. GitHub Actions runs `node scan-games.js`
4. `games.json` is updated and the site lists the new game

### Meta block (required for title/thumb)

```html
<!--
  title: My Game
  description: Short description
  tags: arcade, puzzle
  thumbnail: data:image/svg+xml;base64,....
-->
<!DOCTYPE html>
...
```

Thumbnail must be **embedded** as a data URI (not a separate file).

## If a new game does not show up

1. Open the repo on GitHub → **Actions** tab  
   - Confirm “Scan games” / “Scan games & Deploy” ran **green**
2. Check that `games.json` in the repo includes your new game
3. Hard-refresh the site (Ctrl+Shift+R)
4. If you use **GitHub Pages**: Settings → Pages → Source = **GitHub Actions**
5. Local test:
   ```bash
   node scan-games.js
   npx serve .
   ```
   (Opening `index.html` as a file will not load `games.json`)

## Local

```bash
node scan-games.js
npx serve .
```
