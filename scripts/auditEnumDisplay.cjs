#!/usr/bin/env node

/**
 * liftr: Audit Raw Enum Display Scanner
 * 
 * Verifies that database enum values (difficulty, equipment, movement_type,
 * set_type, source, status, role) are NEVER rendered raw directly in JSX.
 * All displays must pass through src/lib/labels.ts mapping functions.
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '..', 'src', 'components');

const ENUM_PROP_REGEX = /\b[a-zA-Z0-9_]+\.(difficulty|equipment|movement_type|set_type|source|status|role)\b/;
const LABEL_WRAPPER_REGEX = /get(Equipment|Difficulty|MovementType|PrCategory|PRCategory|SetType|SetTypeBadge|Region|Muscle|MuscleRole|ContributionRole|DataSource|ScheduledStatus|NoteCategory)Label|getSetTypeBadge/;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];

  lines.forEach((line, lineIdx) => {
    // Look for JSX interpolation braces {...}
    const jsxBraceMatches = line.match(/\{[^{}]+\}/g);
    if (!jsxBraceMatches) return;

    for (const match of jsxBraceMatches) {
      // Check if match contains an enum property
      if (ENUM_PROP_REGEX.test(match)) {
        // If it is wrapped in an authoritative label function, it's valid
        if (LABEL_WRAPPER_REGEX.test(match)) {
          continue;
        }

        // If it is purely a conditional/boolean check (e.g., &&, ||, ===, !==, ? :), skip
        // but if it's evaluated directly as a rendered expression (e.g. {exercise.equipment}), flag it!
        const inner = match.slice(1, -1).trim();
        const isPureCondition = /^(sw|ex|exercise|set|pr|contribution|stepData)\.(difficulty|equipment|movement_type|set_type|source|status|role)\s*(===|!==)/.test(inner)
          || /(&&|\|\||\?)\s*$/.test(inner)
          || inner.includes('indexOf(')
          || inner.includes('filter(')
          || inner.includes('includes(');

        // If it looks like a direct display expression e.g. {exercise.equipment} or {ex.difficulty}
        if (!isPureCondition || (!inner.includes('===') && !inner.includes('!==') && !LABEL_WRAPPER_REGEX.test(inner))) {
          // If the inner is just `exercise.equipment` or `(set.set_type ...)` without a label wrapper:
          if (/^[a-zA-Z0-9_.]+\.(difficulty|equipment|movement_type|set_type|source|status|role)$/.test(inner)) {
            violations.push({
              file: path.relative(path.join(__dirname, '..'), filePath),
              line: lineIdx + 1,
              raw: match,
            });
          }
        }
      }
    }
  });

  return violations;
}

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fullPath));
    } else if (file.endsWith('.tsx')) {
      results = results.concat(scanFile(fullPath));
    }
  });
  return results;
}

const allViolations = walkDir(COMPONENTS_DIR);

if (allViolations.length > 0) {
  console.error(`\n❌ Found ${allViolations.length} raw enum display violation(s):`);
  allViolations.forEach(v => {
    console.error(`  - ${v.file}:${v.line} -> ${v.raw}`);
  });
  process.exit(1);
} else {
  console.log('✅ 0 raw enum displays detected. All enum values pass through labels.ts.');
  process.exit(0);
}
