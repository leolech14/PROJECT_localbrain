#!/usr/bin/env node
// uv-spec-lint.mjs - Frontmatter v2 + 12 sections linter (ASCII-only)
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import fg from 'fast-glob';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJSON(p){ return JSON.parse(fs.readFileSync(p, 'utf-8')); }

// Load schema and config
const SCHEMA = loadJSON(path.join(__dirname, 'uv-spec-frontmatter-v2.schema.json'));
const CONFIG_PATH = path.resolve(process.cwd(), 'spec.config.json');
const CONFIG = fs.existsSync(CONFIG_PATH) ? loadJSON(CONFIG_PATH) : { globs: ['**/*.md'], sections_required: 12 };

// CLI override: --glob <pattern> (repeatable), --sections <n>
const args = process.argv.slice(2);
function getArg(flag, def){ const i = args.indexOf(flag); return i>=0 ? args[i+1] : def; }
const cliGlobs = [];
for (let i=0; i<args.length; i++) if (args[i] === '--glob' && args[i+1]) cliGlobs.push(args[i+1]);
const sectionsRequired = parseInt(getArg('--sections', CONFIG.sections_required || 12), 10) || 12;
const globs = cliGlobs.length ? cliGlobs : CONFIG.globs;

const REQUIRED_SECTIONS = [
  '## 1. Purpose & Outcomes',
  '## 2. Context & Dependencies',
  '## 3. Public API (Types & Contracts)',
  '## 4. Data & State Model',
  '## 5. Algorithms & Control Flow',
  '## 6. UI & Controls (UCC/CCD)',
  '## 7. Observability (Events & Metrics)',
  '## 8. Performance Budget & Fallbacks',
  '## 9. Security, Privacy & Permissions',
  '## 10. Acceptance Demos & Test Plan',
  '## 11. Implementation Recipe (Ingredients & Steps)',
  '## 12. Integration Checklist & Promotion Gates'
];

const ajv = new Ajv({allErrors:true, strict:false});
addFormats(ajv);
const validate = ajv.compile(SCHEMA);

function parseFrontmatter(md) {
  if (!md.startsWith('---')) return {frontmatter:null, body:md, hasFM:false};
  const end = md.indexOf('\n---', 3);
  if (end === -1) return {frontmatter:null, body:md, hasFM:false};
  const fm = md.slice(3, end).trim();
  const body = md.slice(end+4).replace(/^\n+/, '');
  return {frontmatter: yaml.load(fm) || {}, body, hasFM:true};
}

function hasAllSections(body) {
  let count = 0;
  for (const h of REQUIRED_SECTIONS) if (body.includes(h)) count++;
  return count >= sectionsRequired;
}

(async function main(){
  const files = await fg(globs, { dot:false, onlyFiles:true });
  if (!files.length) {
    console.error('No spec files matched. Update spec.config.json or pass --glob.');
    process.exit(2);
  }
  let ok = true;
  for (const file of files) {
    const md = fs.readFileSync(file, 'utf-8');
    const {frontmatter, body, hasFM} = parseFrontmatter(md);
    if (!hasFM) {
      console.error('X Missing front matter:', file);
      ok = false;
      continue;
    }
    const valid = validate(frontmatter);
    if (!valid) {
      console.error('X Front matter schema errors:', file);
      for (const err of validate.errors) console.error('  -', err.instancePath || '/', err.message);
      ok = false;
    }
    if (!hasAllSections(body)) {
      console.error('X Missing sections (need at least', sectionsRequired, 'of 12):', file);
      for (const h of REQUIRED_SECTIONS) if (!body.includes(h)) console.error('  - missing', h);
      ok = false;
    }
  }
  if (!ok) {
    console.error('Spec validation failed.');
    process.exit(1);
  } else {
    console.log('OK: All specs passed front matter + sections checks.');
  }
})();
