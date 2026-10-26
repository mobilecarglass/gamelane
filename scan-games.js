#!/usr/bin/env node
/**
 * GameLane scanner
 * Reads every *.html in /games, extracts the meta comment block,
 * and writes games.json that the homepage loads.
 *
 * Usage:  node scan-games.js
 */

const fs = require("fs");
const path = require("path");

const GAMES_DIR = path.join(__dirname, "games");
const OUT = path.join(__dirname, "games.json");

function parseMeta(html) {
  const match = html.match(/<!--\s*([\s\S]*?)-->/);
  if (!match) return {};
  const meta = {};
  match[1].split("\n").forEach(line => {
    const m = line.match(/^\s*(\w+)\s*:\s*(.+)\s*$/);
    if (m) {
      const key = m[1].toLowerCase();
      let val = m[2].trim();
      if (key === "tags") val = val.split(",").map(t => t.trim().toLowerCase());
      meta[key] = val;
    }
  });
  return meta;
}

function titleFromId(id) {
  return id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

const files = fs.readdirSync(GAMES_DIR)
  .filter(f => f.endsWith(".html"))
  .sort();

const games = files.map(file => {
  const id = path.basename(file, ".html");
  const html = fs.readFileSync(path.join(GAMES_DIR, file), "utf8");
  const meta = parseMeta(html);

  return {
    id,
    title: meta.title || titleFromId(id),
    description: meta.description || "",
    url: `games/${file}`,
    tags: meta.tags || [],
    thumbnail: meta.thumbnail || null
  };
});

fs.writeFileSync(OUT, JSON.stringify(games, null, 2));
console.log(`✓ games.json updated — ${games.length} game(s)`);
games.forEach(g => console.log(`  • ${g.title}  ${g.thumbnail ? "🖼" : "–"}`));
