#!/usr/bin/env node
/**
 * tools/spec-harvest.mjs — Collects artifacts/tests from specs into a manifest
 * Usage: node tools/spec-harvest.mjs --glob "source_files/uv-specs/**/*.md" --out artifacts-manifest.json
 */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { globby } from "globby";
import matter from "gray-matter";
import YAML from "yaml";

const args = new Map();
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) {
    const k = a.slice(2);
    const v = process.argv[i+1] && !process.argv[i+1].startsWith("--") ? process.argv[i+1] : true;
    args.set(k, v);
    if (v !== true) i++;
  }
}
const glob = args.get("glob") || "source_files/uv-specs**/*.md";
const out = args.get("out") || "artifacts-manifest.json";

const files = await globby(glob, { gitignore: true, absolute: true });
const manifest = {};

for (const file of files) {
  const raw = await fs.readFile(file, "utf8");
  const fm = matter(raw, { delimiters: '---', language: 'yaml', engines: { yaml: s => YAML.parse(s) } });
  const d = fm.data || {};
  if (!d.id) continue;
  manifest[d.id] = {
    id: d.id,
    title: d.title,
    flavor: d.flavor || "reference",
    artifacts: d.artifacts || {},
    performance_budgets: d.performance_budgets || {},
    observability: d.observability || {}
  };
}

await fs.writeFile(out, JSON.stringify(manifest, null, 2));
console.log(`Wrote ${out} with ${Object.keys(manifest).length} specs.`);