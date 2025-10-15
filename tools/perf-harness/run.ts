// tools/perf-harness/run.ts
// Example CLI: node --loader ts-node/esm tools/perf-harness/run.ts --spec path/to/spec.md --results path/to/perf.json
import fs from "node:fs";
import process from "node:process";
import { loadBudgets, assertWithinBudgets } from "./budgets.js";

const args = new Map<string, string|boolean>();
for (let i=2;i<process.argv.length;i++){
  const a=process.argv[i];
  if (a.startsWith("--")) {
    const k=a.slice(2);
    const v=process.argv[i+1] && !process.argv[i+1].startsWith("--") ? process.argv[i+1] : true;
    args.set(k, v);
    if (v!==true) i++;
  }
}
const spec = (args.get("spec") as string) || "SPEC.md";
const resultsPath = (args.get("results") as string) || "perf-results.json";

const budgets = loadBudgets(spec);
const results = JSON.parse(fs.readFileSync(resultsPath,"utf8"));
assertWithinBudgets(results, budgets);
console.log("✔ Performance within budgets");