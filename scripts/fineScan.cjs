const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith(".tsx")) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk("src");
const knownBad = [];

const ALLOWED = new Set([
  "kg", "lbs", "km", "mi", "N/A", "W", "Set", "Drop", "Fail", "UTC", "ESC",
  "&quot;", "&#", "·", "•", "—", "–", "×", ":", "/", "%", "+", "-"
]);

files.forEach(f => {
  const code = fs.readFileSync(f, "utf8");
  const lines = code.split("\n");
  lines.forEach((l, idx) => {
    const trim = l.trim();
    if (trim.startsWith("//") || trim.startsWith("/*") || trim.startsWith("*") || trim.startsWith("type ") || trim.startsWith("interface ")) return;
    
    // Check for raw JSX text
    const m = l.match(/>([^<>{}\r\n]+)</);
    if (m) {
      const text = m[1].trim();
      if (text && !/^[\d\s.,:;+/%–—×()#\-_&|'"`]+$/.test(text) && !ALLOWED.has(text)) {
        knownBad.push({ file: f, line: idx + 1, text, type: "jsx-text" });
      }
    }
    
    // Check for raw placeholder or title props
    const pm = l.match(/\b(placeholder|title)=["']([^"']+)["']/);
    if (pm) {
      const prop = pm[1];
      const val = pm[2].trim();
      if (val && !/^[\d\s.,:;+/%–—×()#\-_]+$/.test(val) && !ALLOWED.has(val)) {
        knownBad.push({ file: f, line: idx + 1, text: `${prop}="${val}"`, type: "prop" });
      }
    }
  });
});

console.log("Raw user-facing JSX/prop occurrences:", knownBad.length);
const byFile = {};
knownBad.forEach(x => {
  if (!byFile[x.file]) byFile[x.file] = [];
  byFile[x.file].push(x);
});
for (const [file, items] of Object.entries(byFile)) {
  console.log(`\n${file} (${items.length}):`);
  items.forEach(it => console.log(`  Line ${it.line}: ${it.type} -> ${it.text}`));
}
