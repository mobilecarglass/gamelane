#!/usr/bin/env node
/**
 * GameLane scanner
 * Scans /games for *.html, reads the top meta comment, writes games.json
 */

const fs = require("fs");
const path = require("path");

const GAMES_DIR = path.join(__dirname, "games");
const OUT = path.join(__dirname, "games.json");

function parseMeta(html) {
  // Allow optional BOM
  html = html.replace(/^\uFEFF/, "");
  const match = html.match(/<!--\s*([\s\S]*?)-->/);
  if (!match) return {};
  const meta = {};
  match[1].split("\n").forEach((line) => {
    const m = line.match(/^\s*([a-zA-Z0-9_-]+)\s*:\s*(.+?)\s*$/);
    if (m) {
      const key = m[1].toLowerCase();
      let val = m[2].trim();
      if (key === "tags") {
        val = val.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
      }
      meta[key] = val;
    }
  });
  return meta;
}

function titleFromId(id) {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

if (!fs.existsSync(GAMES_DIR)) {
  console.error("No games/ folder found");
  process.exit(1);
}

const files = fs
  .readdirSync(GAMES_DIR)
  .filter((f) => f.endsWith(".html") && !f.startsWith("."))
  .sort();

console.log(`Scanning ${files.length} file(s) in games/ ...`);

const games = files.map((file) => {
  const id = path.basename(file, ".html");
  const full = path.join(GAMES_DIR, file);
  const html = fs.readFileSync(full, "utf8");
  const meta = parseMeta(html);

  const game = {
    id,
    title: meta.title || titleFromId(id),
    description: meta.description || "",
    url: `games/${file}`,
    tags: Array.isArray(meta.tags) ? meta.tags : meta.tags ? [meta.tags] : [],
    thumbnail: meta.thumbnail || null,
  };

  console.log(`  ✓ ${game.title} (${file})${game.thumbnail ? " [thumb]" : ""}`);
  return game;
});

fs.writeFileSync(OUT, JSON.stringify(games, null, 2) + "\n");
console.log(`\nWrote ${OUT} with ${games.length} game(s)`);
