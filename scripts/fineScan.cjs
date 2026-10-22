const { walk, scanFile } = require('./scannerHelper.cjs');

const files = [...walk('src'), 'server.ts'];
let total = 0;
const results = [];
files.forEach(file => {
  const items = scanFile(file);
  if (items.length > 0) {
    results.push({ file, items });
    total += items.length;
  }
});

console.log('Raw user-facing JSX/prop occurrences:', total);
results.forEach(({ file, items }) => {
  console.log(`\n${file} (${items.length}):`);
  items.forEach(it => {
    console.log(`  Line ${it.line}: ${it.type} -> ${it.text}`);
  });
});

if (total > 0) {
  process.exit(1);
}
