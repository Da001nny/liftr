#!/usr/bin/env node

/**
 * liftr: Audit Raw Enum Display Scanner
 * 
 * Verifies that:
 * 1. Database enum values (difficulty, equipment, movement_type, set_type, source, status, role)
 *    are NEVER rendered raw directly in JSX (e.g. {exercise.equipment}).
 * 2. Enums are NEVER rendered via template literal interpolations e.g. `${x.equipment}` without label mapping.
 * 3. Enums are NEVER converted via String(x.equipment) in JSX.
 * 4. Raw identifiers with *_id are NEVER formatted via .replace(/_/g in JSX; they must use getExerciseName.
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '..', 'src', 'components');

const ENUM_FIELDS = ['difficulty', 'equipment', 'movement_type', 'set_type', 'source', 'status', 'role'];
const ENUM_PROP_REGEX = new RegExp(`\\b[a-zA-Z0-9_.]+\\.(${ENUM_FIELDS.join('|')})\\b`);
const LABEL_WRAPPER_REGEX = /get(Equipment|Difficulty|MovementType|PrCategory|SetType|SetTypeBadge|Region|Muscle|MuscleRole|DataSource|ScheduledStatus|NoteCategory|ExerciseName)Label|getSetTypeBadge|getExerciseName/;

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];

  lines.forEach((line, lineIdx) => {
    // 1. Check for .replace(/_/g on any *_id or id value in JSX
    if (line.includes('.replace(/_/g') || line.includes(".replace('/_',")) {
      const match = line.match(/\b([a-zA-Z0-9_.]*id)\??\.replace\(\s*\/_[\/g]/);
      if (match) {
        violations.push({
          file: path.relative(path.join(__dirname, '..'), filePath),
          line: lineIdx + 1,
          type: 'RAW_ID_REPLACE',
          raw: line.trim(),
        });
      }
    }

    // 2. Check for ${x.enumField} template string interpolation
    const templateMatches = line.match(/\$\{[^}]+\}/g);
    if (templateMatches) {
      for (const tMatch of templateMatches) {
        if (ENUM_PROP_REGEX.test(tMatch) && !LABEL_WRAPPER_REGEX.test(tMatch)) {
          // If not part of a comparison
          if (!tMatch.includes('===') && !tMatch.includes('!==')) {
            violations.push({
              file: path.relative(path.join(__dirname, '..'), filePath),
              line: lineIdx + 1,
              type: 'TEMPLATE_ENUM_INTERPOLATION',
              raw: tMatch,
            });
          }
        }
      }
    }

    // 3. Check for String(x.enumField)
    if (line.includes('String(')) {
      let idx = line.indexOf('String(');
      while (idx !== -1) {
        let depth = 0;
        let start = idx + 6;
        let end = -1;
        for (let i = start; i < line.length; i++) {
          if (line[i] === '(') depth++;
          else if (line[i] === ')') {
            depth--;
            if (depth === 0) {
              end = i;
              break;
            }
          }
        }
        if (end !== -1) {
          const sMatch = line.slice(idx, end + 1);
          if (ENUM_PROP_REGEX.test(sMatch) && !LABEL_WRAPPER_REGEX.test(sMatch)) {
            violations.push({
              file: path.relative(path.join(__dirname, '..'), filePath),
              line: lineIdx + 1,
              type: 'STRING_CONVERSION_ENUM',
              raw: sMatch,
            });
          }
        }
        idx = line.indexOf('String(', idx + 1);
      }
    }

    // 4. Check for direct JSX interpolation braces {...}
    const jsxBraceMatches = line.match(/\{[^{}]+\}/g);
    if (!jsxBraceMatches) return;

    for (const match of jsxBraceMatches) {
      if (ENUM_PROP_REGEX.test(match)) {
        if (LABEL_WRAPPER_REGEX.test(match)) {
          continue;
        }

        const inner = match.slice(1, -1).trim();
        const isPureCondition = /^(sw|ex|exercise|set|pr|contribution|stepData)\.(difficulty|equipment|movement_type|set_type|source|status|role)\s*(===|!==)/.test(inner)
          || /(&&|\|\||\?)\s*$/.test(inner)
          || inner.includes('indexOf(')
          || inner.includes('filter(')
          || inner.includes('includes(');

        if (!isPureCondition || (!inner.includes('===') && !inner.includes('!==') && !LABEL_WRAPPER_REGEX.test(inner))) {
          if (/^[a-zA-Z0-9_.]+\.(difficulty|equipment|movement_type|set_type|source|status|role)$/.test(inner)) {
            violations.push({
              file: path.relative(path.join(__dirname, '..'), filePath),
              line: lineIdx + 1,
              type: 'RAW_JSX_ENUM_DISPLAY',
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
  console.error(`\n❌ Found ${allViolations.length} enum / id display violation(s):`);
  allViolations.forEach(v => {
    console.error(`  - [${v.type}] ${v.file}:${v.line} -> ${v.raw}`);
  });
  process.exit(1);
} else {
  console.log('✅ 0 raw enum / id display violations detected. All displays pass through labels.ts.');
  process.exit(0);
}
