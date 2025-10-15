// tools/perf-harness/budgets.ts
// Load performance_budgets from a spec file (front matter) and expose helpers.
import fs from "node:fs";
import matter from "gray-matter";
import YAML from "yaml";

export type Budgets = Record<string, number>;

export function loadBudgets(specPath: string): Budgets {
  const raw = fs.readFileSync(specPath, "utf8");
  const fm = matter(raw, { delimiters: "---", language: "yaml", engines: { yaml: (s: string) => YAML.parse(s) } });
  const b = (fm.data as any)?.performance_budgets || {};
  return b as Budgets;
}

export function assertWithinBudgets(results: Record<string, number>, budgets: Budgets) {
  const failures: string[] = [];
  for (const [k, limit] of Object.entries(budgets)) {
    const val = results[k];
    if (typeof val !== "number") continue;
    // Heuristic: keys ending in _max are ceilings; *_min are floors.
    if (/_max$/i.test(k)) {
      if (val > limit) failures.push(`${k}: ${val} > ${limit}`);
    } else if (/_min$/i.test(k)) {
      if (val < limit) failures.push(`${k}: ${val} < ${limit}`);
    } else {
      // default to max
      if (val > limit) failures.push(`${k}: ${val} > ${limit}`);
    }
  }
  if (failures.length) {
    throw new Error("Performance budgets exceeded:\n" + failures.map(s => "  - " + s).join("\n"));
  }
}