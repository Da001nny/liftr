const fs = require('fs');
const path = require('path');

// Authoritative allowlist of non-UI schema tokens, symbols, CSV headers, and RFC 4180 artifacts
const ALLOWED = new Set([
  'kg', // Standard metric unit for mass / weight
  'lbs', // Standard imperial unit for mass / weight
  'km', // Standard metric unit for distance
  'mi', // Standard imperial unit for distance
  'N/A', // Universal abbreviation for not available / not applicable
  'UTC', // Universal Coordinated Time timezone code
  'ESC', // Escape keyboard shortcut symbol
  '⌘K', // Universal keyboard shortcut symbol for Command+K
  '&quot;', // HTML entity for double quote
  '&#', // HTML entity numeric prefix
  '·', // Typographic interpunct dot separator
  '•', // Typographic bullet point separator
  '—', // Typographic em dash separator
  '–', // Typographic en dash separator
  '×', // Mathematical multiplication symbol
  ':', // Standard colon separator
  '/', // Standard slash separator
  '%', // Percentage symbol
  '+', // Mathematical plus sign
  '-', // Mathematical minus sign
  'U+FEFF', // Unicode byte order mark designation
  '#', // Number / hash symbol
  '...', // Ellipsis typographic symbol
  '0', // Numeric digit
  '1', // Numeric digit
  '2', // Numeric digit
  '3', // Numeric digit
  '4', // Numeric digit
  '5', // Numeric digit
  '6', // Numeric digit
  '7', // Numeric digit
  '8', // Numeric digit
  '9', // Numeric digit
  'Date, Workout, Exercise, Set Type, Weight (kg), Reps, Volume (kg), Estimated 1RM (kg)', // Fixed RFC 4180 CSV header specification (metric)
  'Date, Workout, Exercise, Set Type, Weight (lbs), Reps, Volume (lbs), Estimated 1RM (lbs)', // Fixed RFC 4180 CSV header specification (imperial)
  'Date, Weight (kg), Unit, Notes, Source', // Fixed RFC 4180 CSV header specification (bodyweight metric)
  'Date, Weight (lbs), Unit, Notes, Source', // Fixed RFC 4180 CSV header specification (bodyweight imperial)
  'Date, Steps, Goal, Source' // Fixed RFC 4180 CSV header specification (daily steps)
]);

function shouldSkipFile(fullPath) {
  const norm = fullPath.replace(/\\/g, '/');
  if (norm.endsWith('/src/i18n/en.ts') || norm.endsWith('src/i18n/en.ts')) return true; // Dictionary file
  if (norm.endsWith('/src/i18n/index.ts') || norm.endsWith('src/i18n/index.ts')) return true; // Translation engine helper implementation (excluded by file path)
  if (norm.includes('src/constants/csvHeaders.ts')) return true; // Fixed RFC 4180 CSV schema header constants
  if (norm.includes('src/data/')) return true; // Exercise catalog, muscle taxonomy, SQL migration scripts
  if (norm.includes('tests/') || norm.endsWith('.test.ts') || norm.endsWith('.spec.ts')) return true; // Test suites
  if (norm.includes('scripts/')) return true; // Script utilities

  // themePresets.ts: Technical constants for theme palette selections, imported and re-exported by ThemeContext.
  if (norm.endsWith('/src/constants/themePresets.ts') || norm.endsWith('src/constants/themePresets.ts')) return true;

  return false;
}


function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !shouldSkipFile(fullPath)) {
      results.push(fullPath);
    }
  });
  return results;
}

function isCssOrSvgOrCode(str) {
  const s = str.trim();
  if (!s) return true;
  // SVG path commands (e.g. "M ${curr.x} ${curr.y}" or "L 10 20")
  if (/^[MLCQZmlcqz\d\s,.\-+]+$/.test(s)) return true;
  if (/(?:^|\s)[MLCQZmlcqz]\s*(?:\$\{[\w.]+\}|\d+)/.test(s)) return true;
  if (/\b(?:acc|curr)\b/.test(s) && /[MLCQZ]/.test(s)) return true;

  // Code enums & technical identifiers
  if (/^(dark|light|system|asc|desc|all|none|true|false|auto|inherit|initial|manual|health_connect|apple_health|working|warmup|drop|failure|this_occurrence|this_and_future|entire_series|moderate|low|high|session|week|month|all_time|exercise|region|total_volume|this_month_vs_last_month|last_30_days|last_7_days|custom|estimated1RM|heaviestWeight|maxReps|numeric|short|long|2-digit|PATCH|POST|GET|PUT|DELETE|application\/json)$/i.test(s)) return true;
  if (/^temp_|^Bearer\s|\.sql\b/i.test(s)) return true; // Temporary IDs, auth tokens, migration scripts
  if (s.includes('.') && !s.includes(' ') && /^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_.-]+)+$/.test(s)) return true; // i18n dot-notation key (e.g. auth.welcomeBack)

  // Formatted numeric interpolation with sign (e.g. "+${formatWeightValue(...)}")
  if (/^\+?\$\{(?:format|Math|Number)[\w.]*\(/.test(s)) return true;

  // Tailwind CSS classes (including negative utilities like -translate-y-2, -mt-4)
  const tokens = s.split(/\s+/);
  const tailwindPattern = /^(?:-?(?:translate|m|mt|mb|ml|mr|mx|my|inset|top|bottom|left|right|z|rotate|scale)-|bg-|text-|border-|ring-|hover:|dark:|focus:|active:|p-|px-|py-|pt-|pb-|pl-|pr-|w-|h-|min-w-|max-w-|min-h-|max-h-|rounded|flex|grid|hidden|block|inline|absolute|relative|fixed|opacity-|transition|duration-|shadow|cursor-|select-|pointer-|space-|gap-|overflow-|truncate|font-|leading-|tracking-|items-|justify-|col-|row-|whitespace-|animate-|fill-|stroke-)/;
  return tokens.every(tok => tailwindPattern.test(tok) || /^\d+$/.test(tok));
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const hits = [];
  let inClassNameTemplate = false;
  let inJsxElement = false;
  let inOpenTag = false;
  let jsxExprDepth = 0;

  lines.forEach((line, idx) => {
    const lineNum = idx + 1;
    const trim = line.trim();

    // Track multiline className={`...`}
    if (line.includes('className={`')) {
      inClassNameTemplate = true;
    }
    const currentInClassName = inClassNameTemplate;
    if (inClassNameTemplate && line.includes('`}')) {
      inClassNameTemplate = false;
    }

    // 1. Skip comments and type/interface definitions
    if (trim.startsWith('//') || trim.startsWith('/*') || trim.startsWith('*') || trim.startsWith('<!--')) return;
    if (trim.startsWith('type ') || trim.startsWith('interface ') || trim.startsWith('export type ') || trim.startsWith('export interface ')) return;

    // 2. Skip TypeScript generic type annotations in context/store files (e.g. Promise<void>, createContext<...>)
    if (line.includes('createContext<') || line.includes('Promise<') || line.includes(': Promise<')) {
      return;
    }

    // 2b. If scanning server.ts: exempt console.* and log strings, and backend API response error/message fields
    if (filePath.endsWith('server.ts')) {
      if (line.includes('console.') || line.includes('logger.') || line.includes('[Server]') || line.includes('[DB]') || line.includes('[Migration]') || line.includes('log(')) {
        return;
      }
      return;
    }

    // 3. JSX text nodes with {...} expressions stripped (.tsx only)
    if (filePath.endsWith('.tsx')) {
      function checkJsxTextCandidate(rawCandidate) {
        if (!rawCandidate) return;
        // Strip {...} expressions completely
        let stripped = rawCandidate;
        let prev;
        do {
          prev = stripped;
          stripped = stripped.replace(/\{[^{}]*\}/g, '');
        } while (stripped !== prev);

        if (stripped.includes('{') || stripped.includes('}')) return;

        const text = stripped.trim();
        if (!text) return;
        if (ALLOWED.has(text)) return;
        if (/^[\d\s.,:;+/%–—×()#\-_&|'"`]+$/.test(text)) return;
        if (/^(Promise|void|boolean|string|number|any|null|undefined)$/.test(text)) return;
        if (!/[a-zA-Z]/.test(text)) return;
        if (/^(const|let|var|import|export|function|return|if|else|switch|case|break)\b/.test(text)) return;
        if (/[;=]/.test(text) && !text.includes(' ') && !text.includes('(')) return;
        if (text.startsWith('<')) return;
        if (text.startsWith('?') || text.startsWith(':')) return;

        hits.push({ line: lineNum, type: 'jsx-text', text });
      }

      // Check 3a: Inline > ... < on this line
      const jsxRegex = />([^<\r\n]+)</g;
      let jm;
      while ((jm = jsxRegex.exec(line)) !== null) {
        checkJsxTextCandidate(jm[1]);
      }

      // Check 3b: Multi-line JSX text between tags
      let netBraces = 0;
      for (let c of line) {
        if (c === '{') netBraces++;
        else if (c === '}') netBraces--;
      }

      if (jsxExprDepth > 0) {
        jsxExprDepth = Math.max(0, jsxExprDepth + netBraces);
      } else if (trim.startsWith('{') && netBraces > 0) {
        jsxExprDepth = netBraces;
      } else if (inJsxElement) {
        if (trim.includes('<')) {
          const before = trim.slice(0, trim.indexOf('<'));
          checkJsxTextCandidate(before);
          inJsxElement = false;
        } else {
          checkJsxTextCandidate(trim);
        }
      }

      // Check if line opens or closes a JSX element
      if (/<[a-zA-Z][a-zA-Z0-9_.:-]*/.test(trim) && !trim.includes('>') && !trim.includes('/>')) {
        inOpenTag = true;
      } else if (inOpenTag && (trim === '>' || trim.endsWith('>')) && !trim.endsWith('/>') && !trim.endsWith('=>')) {
        inOpenTag = false;
        inJsxElement = true;
        jsxExprDepth = 0;
      } else if (/<[a-zA-Z][a-zA-Z0-9_.:-]*[^>]*>$/.test(trim) && !trim.endsWith('/>') && !trim.endsWith('=>')) {
        inJsxElement = true;
        jsxExprDepth = 0;
      } else if (trim.endsWith('/>') || trim.endsWith('</') || /<\/[a-zA-Z][a-zA-Z0-9_.:-]*>$/.test(trim)) {
        inJsxElement = false;
        inOpenTag = false;
        jsxExprDepth = 0;
      }
    }

    // 4. Props carrying user-facing text: placeholder, title, aria-label, alt
    const propRegex = /\b(placeholder|title|aria-label|alt)=["']([^"']+)["']/g;
    let pm;
    while ((pm = propRegex.exec(line)) !== null) {
      const prop = pm[1];
      const val = pm[2].trim();
      if (!val || ALLOWED.has(val)) continue;
      if (/^[\d\s.,:;+/%–—×()#\-_]+$/.test(val)) continue;
      if (val.startsWith('#') || val.startsWith('{') || val.includes('calc(')) continue;
      if (isCssOrSvgOrCode(val)) continue;
      hits.push({ line: lineNum, type: `prop:${prop}`, text: val });
    }

    // 4b. Props with template or braced strings: prop={`...`} or prop={"..."}
    const propBraceRegex = /\b(placeholder|title|aria-label|alt)=\{\s*["'`]([^"'`]+)["'`]\s*\}/g;
    let pbm;
    while ((pbm = propBraceRegex.exec(line)) !== null) {
      const prop = pbm[1];
      const val = pbm[2].trim();
      if (!val || ALLOWED.has(val) || /^[\d\s.,:;+/%–—×()#\-_]+$/.test(val)) continue;
      if (isCssOrSvgOrCode(val)) continue;
      hits.push({ line: lineNum, type: `prop:${prop}`, text: val });
    }

    // 5. Props or JSX expressions with ternaries: ? branchA : branchB
    // Exclude className, key, id, style, d
    if (!currentInClassName && !line.includes('className') && !line.includes('key=') && !line.includes('id=') && !line.includes('style=') && !line.includes('d=')) {
      const ternaryRegex = /\?([^?:]+):([^,;\r\n]+)/g;
      let tm;
      while ((tm = ternaryRegex.exec(line)) !== null) {
        const branchA = tm[1];
        const branchB = tm[2];
        const strRegex = /["'`]([^"'`]+)["'`]/g;
        let sm;
        while ((sm = strRegex.exec(branchA)) !== null) {
          const val = sm[1].trim();
          const words = val.replace(/\$\{[^}]+\}/g, '').trim();
          if (words && !ALLOWED.has(words) && !isCssOrSvgOrCode(words) && /[a-zA-Z]{2,}/.test(words)) {
            hits.push({ line: lineNum, type: 'ternary', text: val });
          }
        }
        while ((sm = strRegex.exec(branchB)) !== null) {
          const val = sm[1].trim();
          const words = val.replace(/\$\{[^}]+\}/g, '').trim();
          if (words && !ALLOWED.has(words) && !isCssOrSvgOrCode(words) && /[a-zA-Z]{2,}/.test(words)) {
            hits.push({ line: lineNum, type: 'ternary', text: val });
          }
        }
      }
    }

    // 6. Toast, alert, confirm messages
    const dialogRegex = /\b(toast(?:\.(?:success|error|info|warning))?|alert|confirm)\s*\(\s*["'`]([^"'`]+)["'`]/g;
    let dm;
    while ((dm = dialogRegex.exec(line)) !== null) {
      const fn = dm[1];
      const msg = dm[2].trim();
      if (!msg || ALLOWED.has(msg) || isCssOrSvgOrCode(msg)) continue;
      if (/^[\d\s.,:;+/%–—×()#\-_]+$/.test(msg)) continue;
      hits.push({ line: lineNum, type: fn, text: msg });
    }

    // 7. Template strings with user-facing words: {`...`}
    // Strictly ignore className, key, id, style, d, data-
    if (!currentInClassName && !line.includes('className') && !line.includes('key=') && !line.includes('id=') && !line.includes('style=') && !line.includes('d=')) {
      const tplRegex = /\{\s*`([^`]+)`\s*\}/g;
      let tm;
      while ((tm = tplRegex.exec(line)) !== null) {
        const raw = tm[1].trim();
        const words = raw.replace(/\$\{[^}]+\}/g, '').trim();
        if (words && /[a-zA-Z]{3,}/.test(words) && !ALLOWED.has(raw) && !isCssOrSvgOrCode(words)) {
          hits.push({ line: lineNum, type: 'template-literal', text: raw });
        }
      }
    }

    // 8. Object-literal properties named label, title, description, message, text, placeholder, name, tooltip, error, statusMessage
    if (!currentInClassName && !line.includes('className') && !line.includes('key=') && !line.includes('id=') && !line.includes('style=') && !line.includes('d=') && !trim.startsWith('import ')) {
      const objPropRegex = /\b(label|title|description|message|statusMessage|text|placeholder|name|tooltip|error)\s*:\s*["'`]([^"'`\r\n]+)["'`]/g;
      let opm;
      while ((opm = objPropRegex.exec(line)) !== null) {
        const propKey = opm[1];
        const val = opm[2].trim();
        if (!val || ALLOWED.has(val) || isCssOrSvgOrCode(val)) continue;
        if (/^[\d\s.,:;+/%–—×()#\-_]+$/.test(val)) continue;
        const words = val.replace(/\$\{[^}]+\}/g, '').trim();
        if (words && /[a-zA-Z]{2,}/.test(words)) {
          hits.push({ line: lineNum, type: `obj:${propKey}`, text: val });
        }
      }

      // Check statusMessage assignment
      const assignRegex = /\b(statusMessage)\s*=\s*["'`]([^"'`\r\n]+)["'`]/g;
      let am;
      while ((am = assignRegex.exec(line)) !== null) {
        const propKey = am[1];
        const val = am[2].trim();
        if (!val || ALLOWED.has(val) || isCssOrSvgOrCode(val)) continue;
        if (/^[\d\s.,:;+/%–—×()#\-_]+$/.test(val)) continue;
        const words = val.replace(/\$\{[^}]+\}/g, '').trim();
        if (words && /[a-zA-Z]{2,}/.test(words)) {
          hits.push({ line: lineNum, type: `assign:${propKey}`, text: val });
        }
      }
    }
  });

  return hits;
}


module.exports = { walk, scanFile, ALLOWED };
