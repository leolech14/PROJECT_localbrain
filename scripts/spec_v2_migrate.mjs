#!/usr/bin/env node
// spec_v2_migrate.mjs - migrate YAML front matter to v2 and append missing sections
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import fg from 'fast-glob';

const args = process.argv.slice(2);
function getArg(flag, def){ const i = args.indexOf(flag); return i>=0 ? args[i+1] : def; }
const SPEC_ROOT = getArg('--spec-root', process.cwd());
const MODE = getArg('--mode', 'dry'); // dry|update|print
const CATEGORY_BY_PATH = args.includes('--category-by-path');
const NOW = new Date().toISOString().slice(0,10);

const CATEGORIES = new Set(['1-mod','2-scf','3-cfg','4-gov','5-ops']);
function inferCategoryFromPath(rel){
  const parts = rel.split('/');
  for (const p of parts) if (CATEGORIES.has(p)) return p;
  if (rel.includes('batch3') || rel.includes('batch4')) return '1-mod';
  if (rel.includes('batch7') || rel.includes('batch12')) return '2-scf';
  if (rel.includes('batch8') || rel.includes('batch10')) return '5-ops';
  return '3-cfg';
}
function flavorFor(cat){ return (cat==='1-mod'||cat==='2-scf') ? 'codegen' : 'reference'; }

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

const DEFAULT_PROMOTION = {
  i1: ['Front matter valid against schema v2','All 12 sections present'],
  i2: ['Unit and integration tests implemented and green'],
  i3: ['GPU snapshot and perf gates pass on perf scenes'],
  complete: ['Docs done; sample recipe added; release notes drafted']
};

const files = fg.sync('**/*.md', { cwd: SPEC_ROOT, onlyFiles: true });

let visited=0, changed=0;
for (const rel of files){
  const p = path.join(SPEC_ROOT, rel);
  const md = fs.readFileSync(p, 'utf-8');
  const hasFM = md.startsWith('---');
  let front={}, body=md;
  if (hasFM){
    const end = md.indexOf('\n---', 3);
    if (end !== -1){
      const fm = md.slice(3, end).trim();
      body = md.slice(end+4).replace(/^\n+/, '');
      try { front = yaml.load(fm) || {}; } catch(e){ front = {}; }
    }
  }
  visited++;

  // Fill front matter
  front.spec_id = front.spec_id || path.basename(rel, '.md').toUpperCase().replace(/[^A-Z0-9_]/g,'_');
  front.title = front.title || path.basename(rel, '.md');
  front.version = front.version || '0.1.0';
  front.owner = front.owner || 'Leo';
  front.status = front.status || 'draft';
  front.batch = front.batch || '?';
  const cat = front.category || (CATEGORY_BY_PATH ? inferCategoryFromPath(rel) : '3-cfg');
  front.category = cat;
  front.flavor = front.flavor || flavorFor(cat);
  front.created = front.created || NOW;
  front.updated = NOW;
  front.promotion_gates = front.promotion_gates || DEFAULT_PROMOTION;
  const ns = 'uv.' + (front.spec_id||'spec').toLowerCase().replace(/[^a-z0-9]+/g,'.');
  front.observability = front.observability || { events_namespace: ns, metrics_prefix: ns, event_list: [] };
  if (!front.observability.events_namespace) front.observability.events_namespace = ns;
  if (!front.observability.metrics_prefix) front.observability.metrics_prefix = ns;

  // Append missing sections
  const missing = REQUIRED_SECTIONS.filter(h => !body.includes(h));
  if (missing.length){
    body = body.trimEnd() + '\n\n' + missing.map(h => h + '\nTBD\n').join('\n\n');
  }

  const out = '---\n' + yaml.dump(front, { lineWidth: 120, noRefs: true }) + '---\n\n' + body;
  if (out !== md){
    changed++;
    if (MODE === 'update') fs.writeFileSync(p, out, 'utf-8');
    else if (MODE === 'print'){ console.log('# FILE:', rel); console.log(out); }
  }
}

console.log(`Visited ${visited} files; ${MODE==='update'?'updated': 'would update'} ${changed}.`);
