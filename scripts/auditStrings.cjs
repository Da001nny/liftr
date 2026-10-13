const fs = require('fs');
const path = require('path');

async function main() {
  const { en } = await import('../src/i18n/en.ts');

  function getNestedKeys(obj, prefix = '') {
    let keys = [];
    for (const k of Object.keys(obj)) {
      const nextPrefix = prefix ? `${prefix}.${k}` : k;
      if (obj[k] && typeof obj[k] === 'object' && !Array.isArray(obj[k])) {
        keys = keys.concat(getNestedKeys(obj[k], nextPrefix));
      } else {
        keys.push(nextPrefix);
      }
    }
    return keys;
  }
  const allDictionaryKeys = new Set(getNestedKeys(en));

  function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(fullPath));
      } else if (file.endsWith('.tsx')) {
        results.push(fullPath);
      }
    });
    return results;
  }

  const files = walk('src');
  const hitsByFile = {};

  // RFC 4180 CSV column headers and file-format schema tokens (not UI text)
  const ALLOWED_VALUES = new Set([
    'kg', 'lbs', 'km', 'mi', 'N/A', '×', '—', '–', '·', '•', '+', '-', ':', '/', '%',
    '#', '...', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'U+FEFF', 'W', 'Drop', 'Fail', 'Set', 'UTC',
    'Date, Workout, Exercise, Set Type, Weight (kg), Reps, Volume (kg), Estimated 1RM (kg)',
    'Date, Workout, Exercise, Set Type, Weight (lbs), Reps, Volume (lbs), Estimated 1RM (lbs)',
    'Date, Weight (kg), Unit, Notes, Source',
    'Date, Weight (lbs), Unit, Notes, Source',
    'Date, Steps, Goal, Source'
  ]);

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) return;

      // 1. Check raw JSX text >...<
      const jsxRegex = />([^<>{}\r\n]+)</g;
      let jm;
      while ((jm = jsxRegex.exec(line)) !== null) {
        const text = jm[1].trim();
        if (
          text &&
          !ALLOWED_VALUES.has(text) &&
          !/^[\d\s.,:;+/%–—×()#\-_&|'"`]+$/.test(text) &&
          !text.includes('&quot;') &&
          !text.includes('&#')
        ) {
          if (!hitsByFile[file]) hitsByFile[file] = [];
          hitsByFile[file].push({ line: lineNum, type: 'jsx-text', text });
        }
      }

      // 2. Check props that typically carry user-facing text
      const propRegex = /\b(placeholder|aria-label|title|label|heading|subtitle|message|confirmText|cancelText|emptyMessage|header)=["']([^"']+)["']/g;
      let pm;
      while ((pm = propRegex.exec(line)) !== null) {
        const prop = pm[1];
        const val = pm[2].trim();
        if (
          val &&
          !ALLOWED_VALUES.has(val) &&
          !val.startsWith('{') &&
          !val.includes('calc(') &&
          !val.startsWith('#') &&
          !/^[\d\s.,:;+/%–—×()#\-_]+$/.test(val)
        ) {
          if (!hitsByFile[file]) hitsByFile[file] = [];
          hitsByFile[file].push({ line: lineNum, type: `prop:${prop}`, text: val });
        }
      }

      // 3. Check template strings with words inside JSX: {`...`}
      const templateRegex = /\{\s*`([^`]+)`\s*\}/g;
      let tm;
      while ((tm = templateRegex.exec(line)) !== null) {
        const raw = tm[1].trim();
        // if contains alphabetic words longer than 2 chars that aren't variables
        const words = raw.replace(/\$\{[^}]+\}/g, '').trim();
        if (words && /[a-zA-Z]{3,}/.test(words)) {
          if (!hitsByFile[file]) hitsByFile[file] = [];
          hitsByFile[file].push({ line: lineNum, type: 'template-string', text: raw });
        }
      }

      // 4. Check alert('...') or confirm('...')
      const alertRegex = /\b(alert|confirm)\s*\(\s*["'`]([^"'`]+)["'`]/g;
      let alm;
      while ((alm = alertRegex.exec(line)) !== null) {
        if (!hitsByFile[file]) hitsByFile[file] = [];
        hitsByFile[file].push({ line: lineNum, type: alm[1], text: alm[2] });
      }
    });
  });

  let count = 0;
  for (const [file, items] of Object.entries(hitsByFile)) {
    console.log(`\n=== ${file} (${items.length} items) ===`);
    items.forEach(it => {
      count++;
      console.log(`  Line ${it.line} [${it.type}]: "${it.text}"`);
    });
  }
  console.log(`\nTotal items: ${count}`);
}

main().catch(err => console.error(err));
