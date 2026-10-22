const { walk, scanFile } = require('./scannerHelper.cjs');

async function main() {
  const files = [...walk('src'), 'server.ts'];
  let count = 0;
  files.forEach(file => {
    const items = scanFile(file);
    if (items.length > 0) {
      console.log(`\n=== ${file} (${items.length} items) ===`);
      items.forEach(it => {
        count++;
        console.log(`  Line ${it.line} [${it.type}]: "${it.text}"`);
      });
    }
  });
  console.log(`\nTotal items: ${count}`);
  if (count > 0) {
    process.exit(1);
  }
}

main().catch(err => console.error(err));
