// scripts/find-wa.js
// Usage: node scripts/find-wa.js
// Looks for occurrences of a phone number or wa.me links in project files.

const fs = require("fs");
const path = require("path");

// CONFIG: ajustá el número que quieras buscar (con o sin +)
const SEARCH_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+5491127797320";
const SEARCH_NUMBER_VARIANTS = [
  SEARCH_NUMBER,
  SEARCH_NUMBER.replace(/^\+/, ""), // without plus
];

// También buscamos enlaces wa.me al número, y wa.me en general
const SEARCH_PATTERNS = [
  // exact number appearances
  ...SEARCH_NUMBER_VARIANTS.map((s) => s),
  // wa.me links with optional + or not
  `https://wa.me/${SEARCH_NUMBER}`,
  `https://wa.me/${SEARCH_NUMBER.replace(/^\+/, "")}`,
  // common hardcoded forms
  `https://wa.me/+${SEARCH_NUMBER.replace(/^\+/, "")}`,
  `https://api.whatsapp.com/send?phone=${SEARCH_NUMBER.replace(/^\+/, "")}`,
  `https://api.whatsapp.com/send?phone=+${SEARCH_NUMBER.replace(/^\+/, "")}`,
];

// extensiones a escanear
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".html", ".css", ".md"];

// Ignorar node_modules y .git y .next y dist
const IGNORE_DIRS = new Set(["node_modules", ".git", ".next", "dist", "out"]);

// Recorrer recursivamente
function walk(dir, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, fileList);
    else fileList.push(full);
  }
  return fileList;
}

function matchesAnyPattern(line) {
  const l = line;
  // simple contains, case-sensitive (numbers are case-insensitive irrelevant)
  for (const p of SEARCH_PATTERNS) {
    if (l.includes(p)) return p;
  }
  // also detect raw digits sequence of the number without separators
  const digitsOnly = SEARCH_NUMBER.replace(/[^\d]/g, "");
  if (l.replace(/[^\d]/g, "").includes(digitsOnly)) return digitsOnly;
  return null;
}

function shortSnippet(line, matchIndex, context = 40) {
  // return a clipped snippet around matchIndex
  if (matchIndex < 0) return line.trim();
  const start = Math.max(0, matchIndex - context);
  const end = Math.min(line.length, matchIndex + context);
  let s = line.slice(start, end).trim();
  if (start > 0) s = "…" + s;
  if (end < line.length) s = s + "…";
  return s;
}

function run() {
  const base = process.cwd();
  console.log(`Scanning ${base} for WhatsApp links / number variants...`);
  const allFiles = walk(base);
  const candidates = allFiles.filter((f) => EXTENSIONS.includes(path.extname(f).toLowerCase()));

  let totalMatches = 0;
  for (const file of candidates) {
    let content;
    try {
      content = fs.readFileSync(file, "utf8");
    } catch (err) {
      continue;
    }
    const lines = content.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const found = matchesAnyPattern(line);
      if (found) {
        totalMatches++;
        const idx = line.indexOf(found);
        const snippet = shortSnippet(line, idx === -1 ? 0 : idx, 80);
        console.log(`\n[${path.relative(base, file)}:${i + 1}] -> matched: "${found}"`);
        console.log(`  ${snippet}`);
      }
    }
  }
  console.log("\nDone.");
  console.log(`Total matches found: ${totalMatches}`);
  if (totalMatches === 0) {
    console.log("No occurrences found of the configured number / wa.me patterns.");
  } else {
    console.log("Review the files above and replace manually (or automate carefully).");
  }
}

run();
