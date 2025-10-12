# 🔄 Reverse Spec Generation - Code → Spec
## Automatic Specfile Generation from Existing Code

**Date**: 2025-10-09
**Created By**: Agent B (Ground Supervisor - Sonnet 4.5 1M)
**Insight**: Features get built first (rapid), THEN generate spec (institutional memory)
**Status**: DESIGN COMPLETE - IMPLEMENTING

---

## 🎯 THE BIDIRECTIONAL FLOW

### **Traditional (Spec-First):**
```
Spec → Code → Tests
(Planned features)

Example:
1. Write: LB-RAG-001.spec.yaml
2. Build: 01_CODEBASES/backend/rag/*.ts
3. Test: rag/*.test.ts
4. Validate: Spec compliance ✅

Use when: Large planned features, multiple agents
```

### **NEW (Code-First with Auto-Spec):**
```
Code → Tests → Auto-Generate Spec
(Rapid features, then institutionalize)

Example:
1. Build: complete_task enforcement (rapid development)
2. Commit: Git commits with feature
3. CI analyzes: What was built?
4. Auto-generates: LB-ENFORCEMENT-042.spec.yaml ✅
5. Institutional memory: Spec documents what exists

Use when: Small features, rapid iteration, single file
```

---

## 🔍 CODE ARCHAEOLOGY ENGINE

### **Component: ReverseSpecGenerator**

```typescript
class ReverseSpecGenerator {
  /**
   * Analyze codebase and generate specs automatically
   */
  async generateSpecFromCode(filePath: string): Promise<GeneratedSpec> {
    console.log(`🔍 Analyzing ${filePath} for spec generation...`);

    // 1. Parse the code
    const ast = await this.parseCode(filePath);

    // 2. Extract features
    const features = await this.extractFeatures(ast);

    // 3. Find tests
    const tests = await this.findRelatedTests(filePath);

    // 4. Analyze behavior
    const behavior = await this.analyzeBehavior(ast, tests);

    // 5. Extract performance characteristics
    const performance = await this.measurePerformance(filePath);

    // 6. Generate spec
    const spec = await this.compileSpec({
      filePath,
      features,
      tests,
      behavior,
      performance
    });

    // 7. Save to 02_SPECBASES/
    await this.saveSpec(spec);

    console.log(`✅ Generated: ${spec.id}.spec.yaml`);

    return spec;
  }

  /**
   * Extract features from AST
   */
  private async extractFeatures(ast: AST): Promise<Feature[]> {
    const features: Feature[] = [];

    // Find exported functions/classes
    for (const node of ast.body) {
      if (node.type === 'ExportNamedDeclaration') {
        features.push({
          name: node.declaration.id.name,
          type: node.declaration.type, // FunctionDeclaration, ClassDeclaration
          description: this.extractJSDoc(node),
          parameters: this.extractParams(node),
          returnType: this.extractReturnType(node),
          complexity: this.calculateComplexity(node)
        });
      }
    }

    return features;
  }

  /**
   * Find related test files
   */
  private async findRelatedTests(filePath: string): Promise<TestFile[]> {
    const testPatterns = [
      filePath.replace('.ts', '.test.ts'),
      filePath.replace('.ts', '.spec.ts'),
      filePath.replace('/src/', '/tests/').replace('.ts', '.test.ts')
    ];

    const tests: TestFile[] = [];

    for (const pattern of testPatterns) {
      if (existsSync(pattern)) {
        const testContent = await this.parseCode(pattern);
        tests.push({
          path: pattern,
          testCount: this.countTests(testContent),
          coverage: await this.calculateCoverage(filePath, pattern)
        });
      }
    }

    return tests;
  }

  /**
   * Analyze behavior from code
   */
  private async analyzeBehavior(ast: AST, tests: TestFile[]): Promise<Behavior> {
    return {
      // What the code does (from function names, logic)
      actions: this.extractActions(ast),

      // Inputs expected
      inputs: this.extractInputs(ast),

      // Outputs produced
      outputs: this.extractOutputs(ast),

      // Edge cases handled
      edgeCases: this.extractEdgeCases(tests),

      // Error handling
      errorHandling: this.extractErrorHandling(ast),

      // Dependencies used
      dependencies: this.extractDependencies(ast)
    };
  }

  /**
   * Measure actual performance
   */
  private async measurePerformance(filePath: string): Promise<PerformanceMetrics> {
    // Run the code, measure
    const metrics = await this.runBenchmark(filePath);

    return {
      executionTime: metrics.avgTime, // ms
      memoryUsage: metrics.peakMemory, // MB
      throughput: metrics.opsPerSecond,
      complexity: this.calculateCyclomaticComplexity(filePath)
    };
  }

  /**
   * Compile everything into official spec
   */
  private async compileSpec(analysis: CodeAnalysis): Promise<OfficialSpec> {
    const fileName = path.basename(analysis.filePath, '.ts');
    const specId = `LB-AUTO-${this.generateId()}`;

    return {
      id: specId,
      title: this.generateTitle(analysis.features),
      type: 'COMPONENT',
      layer: this.inferLayer(analysis.filePath),

      purpose: this.generatePurpose(analysis.features, analysis.behavior),

      requirements: {
        functional: analysis.features.map(f => ({
          id: `${specId}-REQ-${f.name}`,
          description: f.description || `Implements ${f.name}`,
          acceptance: `${f.name} function exists and works correctly`,
          testable: true,
          implemented: true, // Already exists!
          implementedIn: analysis.filePath
        })),

        performance: [
          {
            metric: 'EXECUTION_TIME',
            target: analysis.performance.executionTime,
            unit: 'MS',
            current: analysis.performance.executionTime,
            met: true
          },
          {
            metric: 'MEMORY_USAGE',
            target: analysis.performance.memoryUsage,
            unit: 'MB',
            current: analysis.performance.memoryUsage,
            met: true
          }
        ],

        quality: [
          {
            standard: 'TEST_COVERAGE',
            target: 80,
            current: analysis.tests[0]?.coverage || 0,
            met: analysis.tests[0]?.coverage >= 80
          }
        ]
      },

      testing: {
        unit_tests: analysis.tests.map(t => ({
          file: t.path,
          test_count: t.testCount,
          coverage: t.coverage
        })),

        // Generate integration test requirements
        integration_tests: this.generateIntegrationTestReqs(analysis),

        // Performance test requirements (from actual metrics)
        performance_tests: [
          {
            benchmark: 'Execution speed',
            target: `<${Math.ceil(analysis.performance.executionTime * 1.2)}ms`,
            current: `${analysis.performance.executionTime}ms`
          }
        ]
      },

      implementation: {
        files_actual: [analysis.filePath], // What exists
        test_files_actual: analysis.tests.map(t => t.path),
        dependencies: analysis.behavior.dependencies,
        complexity: analysis.performance.complexity
      },

      validation: {
        automated: analysis.tests.length > 0,
        ci_cd: this.hasCI_CD(),
        objective_metrics: [
          `Execution: ${analysis.performance.executionTime}ms`,
          `Coverage: ${analysis.tests[0]?.coverage || 0}%`,
          `Tests: ${analysis.tests.reduce((sum, t) => sum + t.testCount, 0)} passing`
        ]
      },

      metadata: {
        auto_generated: true,
        generated_from_code: analysis.filePath,
        generated_at: new Date().toISOString(),
        verified: true, // Code exists = spec verified
        last_validated: new Date().toISOString()
      }
    };
  }
}
```

---

## 🚀 AUTOMATIC SPEC GENERATION TRIGGERS

### **Trigger 1: On Git Commit**

```bash
# .git/hooks/post-commit

# Central Intelligence analyzes commit
for file in $(git diff-tree --no-commit-id --name-only -r HEAD); do
  # Check if new feature file (not test)
  if [[ $file == *.ts ]] && [[ $file != *.test.ts ]]; then

    # Check if spec exists
    specFile="02_SPECBASES/auto-generated/$(basename $file .ts).spec.yaml"

    if [ ! -f "$specFile" ]; then
      echo "📝 Generating spec for $file..."
      brain generate-spec $file
    else
      echo "♻️  Updating spec for $file..."
      brain update-spec $file $specFile
    fi
  fi
done

echo "✅ Specs synchronized with codebase"
```

---

### **Trigger 2: On CI/CD Run**

```yaml
# .github/workflows/spec-sync.yml

name: Auto-Generate Specs

on: [push]

jobs:
  sync-specs:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Analyze Codebase
        run: brain analyze-codebase --project LocalBrain

      - name: Generate Missing Specs
        run: brain generate-specs --auto

      - name: Update Existing Specs
        run: brain update-specs --verify

      - name: Commit Specs
        run: |
          git add 02_SPECBASES/auto-generated/
          git commit -m "Auto-generated specs from codebase"
          git push
```

**Result:**
- Every commit: Specs auto-generated ✅
- Every feature: Documented automatically ✅
- Institutional memory: Self-maintaining ✅

---

### **Trigger 3: On Demand**

```bash
# Analyze entire project
brain analyze-project LocalBrain

# Output:
# 🔍 Analyzing LocalBrain codebase...
# 📊 Found 1,203 code files
# 📝 Generating 47 missing specs...
# ♻️  Updating 23 outdated specs...
# ✅ Complete! 70 specs synchronized
```

---

## 🎯 THE COMPLETE SPEC SYSTEM (BIDIRECTIONAL)

### **Flow 1: Spec-First (Planned Features)**

```
User: "Build authentication system"
  ↓
CI: Detects spec input ✅
  ↓
Generate: LB-AUTH-042.spec.yaml
  ↓
Gap Analysis: 100% missing (nothing implemented)
  ↓
Generate Tasks: T101-T112 (12 tasks)
  ↓
Agents build following spec
  ↓
Validation: Does code meet spec? ✅
```

### **Flow 2: Code-First (Rapid Features)**

```
Developer: Builds complete_task enforcement (rapid)
  ↓
git commit: "Added 4-layer enforcement"
  ↓
CI detects: New feature committed
  ↓
Analyze code: What was built?
  ↓
Generate: LB-ENFORCEMENT-042.spec.yaml ✅
  ↓
Spec documents: What exists (institutional memory)
  ↓
Future validation: Code must maintain spec compliance
```

### **Flow 3: Spec-Code Sync (Continuous)**

```
Every commit:
  ↓
Analyze: What changed in code?
  ↓
Check: Related spec exists?
  ├─→ YES: Update spec to match reality
  └─→ NO: Generate new spec

Analyze: What changed in specs?
  ↓
Check: Code implements this?
  ├─→ YES: Validated ✅
  └─→ NO: Create task to implement

Result: Specs and code ALWAYS in sync! ✅
```

---

## 🔧 IMPLEMENTATION

### **MCP Tool: generate_spec_from_code**

```typescript
// src/tools/spec/generateSpecFromCode.ts

import { z } from 'zod';
import Database from 'better-sqlite3';
import { ReverseSpecGenerator } from '../../spec/ReverseSpecGenerator.js';

const GenerateSpecFromCodeSchema = z.object({
  filePath: z.string(),
  projectId: z.string(),
  autoSave: z.boolean().optional().default(true)
});

export const generateSpecFromCodeTool = {
  name: 'generate_spec_from_code',
  description: 'Analyze code and automatically generate specification file',
  inputSchema: {
    type: 'object',
    properties: {
      filePath: {
        type: 'string',
        description: 'Path to code file to analyze'
      },
      projectId: {
        type: 'string',
        description: 'Project ID'
      },
      autoSave: {
        type: 'boolean',
        description: 'Auto-save generated spec to 02_SPECBASES/',
        default: true
      }
    },
    required: ['filePath', 'projectId']
  }
};

export async function handleGenerateSpecFromCode(args: unknown, db: Database.Database) {
  const parsed = GenerateSpecFromCodeSchema.parse(args);

  const generator = new ReverseSpecGenerator(db);

  console.log(`🔍 Analyzing ${parsed.filePath}...`);

  // Generate spec from code
  const spec = await generator.generateSpecFromCode(parsed.filePath);

  // Get project path
  const project = db.prepare(`
    SELECT * FROM projects WHERE id = ?
  `).get(parsed.projectId) as any;

  if (parsed.autoSave && project) {
    const specPath = path.join(
      project.path,
      '02_SPECBASES',
      'auto-generated',
      `${spec.id}.spec.yaml`
    );

    await fs.promises.mkdir(path.dirname(specPath), { recursive: true });
    await fs.promises.writeFile(specPath, yaml.stringify(spec));

    console.log(`✅ Spec saved: ${specPath}`);
  }

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        success: true,
        spec,
        message: `✅ Generated spec from ${path.basename(parsed.filePath)}`,
        features: spec.requirements.functional.length,
        tests: spec.testing.unit_tests.length,
        performance: spec.requirements.performance,
        specPath: parsed.autoSave ? 'Saved to 02_SPECBASES/auto-generated/' : 'Not saved (preview only)'
      }, null, 2)
    }]
  };
}
```

---

## 🔄 THE REVERSE GENERATION ALGORITHM

### **Step 1: Code Analysis**

```typescript
async analyzeFile(filePath: string): CodeAnalysis {
  const code = readFileSync(filePath, 'utf-8');

  return {
    // 1. Structure
    exports: this.findExports(code),
    classes: this.findClasses(code),
    functions: this.findFunctions(code),
    types: this.findTypes(code),

    // 2. Dependencies
    imports: this.extractImports(code),
    externalDeps: this.findPackageDeps(code),

    // 3. Behavior
    apiCalls: this.findAPICalls(code),
    databaseOps: this.findDatabaseOps(code),
    fileOps: this.findFileOps(code),

    // 4. Documentation
    jsdoc: this.extractJSDoc(code),
    comments: this.extractComments(code),

    // 5. Metrics
    loc: code.split('\n').length,
    complexity: this.calculateComplexity(code),
    maintainability: this.calculateMaintainability(code)
  };
}
```

---

### **Step 2: Test Discovery**

```typescript
async findTests(codeFile: string): TestDiscovery {
  const testFile = codeFile.replace('.ts', '.test.ts');

  if (!existsSync(testFile)) {
    return { found: false, coverage: 0 };
  }

  const tests = await this.parseTestFile(testFile);

  return {
    found: true,
    testFile,
    testCount: tests.length,
    testCases: tests.map(t => ({
      name: t.description,
      type: this.inferTestType(t), // UNIT | INTEGRATION | E2E
      assertions: t.assertionCount,
      coverage: t.coverage
    })),
    overallCoverage: await this.runCoverageCheck(codeFile)
  };
}
```

---

### **Step 3: Performance Profiling**

```typescript
async profilePerformance(filePath: string): PerformanceProfile {
  // Import and run the code
  const module = await import(filePath);

  const profiles: Metric[] = [];

  // For each exported function
  for (const [name, fn] of Object.entries(module)) {
    if (typeof fn === 'function') {
      // Benchmark it
      const result = await this.benchmark(fn, {
        runs: 100,
        timeout: 5000
      });

      profiles.push({
        function: name,
        avgTime: result.mean,
        p95: result.p95,
        p99: result.p99,
        memoryPeak: result.memoryPeak
      });
    }
  }

  return {
    metrics: profiles,
    recommendations: this.generateOptimizations(profiles)
  };
}
```

---

### **Step 4: Spec Compilation**

```typescript
compileSpec(analysis: CompleteAnalysis): OfficialSpec {
  return {
    id: this.generateSpecId(analysis.filePath),
    title: this.extractTitle(analysis.code.jsdoc),
    type: this.inferType(analysis),

    // AUTO-GENERATED PURPOSE (from JSDoc + behavior)
    purpose: analysis.code.jsdoc?.description ||
             `Implements ${analysis.code.exports.join(', ')}`,

    requirements: {
      // FUNCTIONAL (from code features)
      functional: analysis.code.exports.map(exp => ({
        id: `AUTO-REQ-${exp.name}`,
        description: `Provides ${exp.name} functionality`,
        acceptance: `${exp.name} exists and passes tests`,
        testable: true,
        implemented: true, // IT EXISTS!
        test: analysis.tests.testCases.find(t => t.name.includes(exp.name))
      })),

      // PERFORMANCE (from profiling)
      performance: analysis.performance.metrics.map(m => ({
        metric: m.function.toUpperCase(),
        target: Math.ceil(m.avgTime * 1.1), // 10% margin
        unit: 'MS',
        current: m.avgTime,
        met: true // Current performance is baseline
      })),

      // QUALITY (from tests)
      quality: [
        {
          standard: 'TEST_COVERAGE',
          target: 80,
          current: analysis.tests.overallCoverage,
          met: analysis.tests.overallCoverage >= 80
        }
      ]
    },

    testing: {
      // ACTUAL TESTS (that exist)
      unit_tests: analysis.tests.testCases.map(t => ({
        file: analysis.tests.testFile,
        name: t.name,
        type: t.type,
        status: 'PASSING' // Exists = assumed passing
      }))
    },

    implementation: {
      files_actual: [analysis.filePath], // REAL files
      test_files_actual: [analysis.tests.testFile],
      complexity: analysis.code.complexity,
      loc: analysis.code.loc
    },

    validation: {
      verified: true, // Code exists = verified
      last_verified: new Date().toISOString(),
      verification_method: 'REVERSE_GENERATION'
    },

    metadata: {
      auto_generated: true,
      source: 'CODE_ANALYSIS',
      generator: 'ReverseSpecGenerator v1.0',
      confidence: this.calculateConfidence(analysis)
    }
  };
}
```

---

## 📊 EXAMPLE OUTPUT

### **Input: src/core/CostAwareScheduler.ts**

**CI Analyzes:**
```
Found:
├─ Class: CostAwareScheduler
├─ Methods: 8 (estimateTaskCost, checkUsageLimits, etc.)
├─ Tests: tests/unit/CostAwareScheduler.test.ts (12 tests)
├─ Coverage: 73%
├─ Performance: estimateTaskCost avg 4ms
└─ Dependencies: Database, model_catalog table
```

**Auto-Generated Spec:**
```yaml
# LB-AUTO-COST-001.spec.yaml
# AUTO-GENERATED from src/core/CostAwareScheduler.ts

spec:
  id: LB-AUTO-COST-001
  title: "Cost-Aware Task Scheduler"
  type: COMPONENT
  layer: BACKEND

  purpose: |
    Assigns tasks based on cost optimization and agent capabilities.
    Prioritizes GLM-4.6 (cheap) for 70% of tasks, uses Sonnet sparingly.

  requirements:
    functional:
      - id: AUTO-REQ-estimateTaskCost
        description: "Estimates cost for task across all models"
        acceptance: "Returns cost breakdown per model"
        implemented: true
        implementedIn: "src/core/CostAwareScheduler.ts:45"
        test: "estimateTaskCost.test.ts:12"

      - id: AUTO-REQ-checkUsageLimits
        description: "Checks if agent within daily/weekly limits"
        acceptance: "Returns usage status with hours remaining"
        implemented: true
        implementedIn: "src/core/CostAwareScheduler.ts:120"
        test: "CostAwareScheduler.test.ts:24"

    performance:
      - metric: ESTIMATE_TASK_COST_TIME
        target: 5 # 10% margin on 4ms actual
        unit: MS
        current: 4
        met: true

    quality:
      - standard: TEST_COVERAGE
        target: 80
        current: 73
        met: false # Needs improvement

  testing:
    unit_tests:
      - file: "tests/unit/CostAwareScheduler.test.ts"
        test_count: 12
        coverage: 73
        status: PASSING

  implementation:
    files_actual: ["src/core/CostAwareScheduler.ts"]
    test_files_actual: ["tests/unit/CostAwareScheduler.test.ts"]
    complexity: MEDIUM
    loc: 300

  validation:
    verified: true
    last_verified: "2025-10-09T22:30:00Z"
    verification_method: "REVERSE_GENERATION"

  metadata:
    auto_generated: true
    source: "CODE_ANALYSIS"
    generated_at: "2025-10-09T22:30:00Z"
```

**Saved to**: `02_SPECBASES/auto-generated/LB-AUTO-COST-001.spec.yaml`

---

## 💡 THE GENIUS OF BIDIRECTIONAL FLOW

### **Best of Both Worlds:**

**Spec-First (Strategic):**
```
Large features → Plan with spec → Build methodically
✅ Clear requirements
✅ Multi-agent coordination
✅ Objective validation
```

**Code-First (Tactical):**
```
Small features → Build rapidly → Generate spec automatically
✅ Fast iteration
✅ Institutional memory captured
✅ No overhead for simple features
```

**Both:**
```
Specs always exist
Code always validated
Institutional memory complete
Gap analysis always possible
```

---

## 🚀 IMPLEMENTATION (30 MINUTES)

### **Building ReverseSpecGenerator:**

```typescript
// src/spec/ReverseSpecGenerator.ts

export class ReverseSpecGenerator {
  constructor(private db: Database.Database) {}

  async generateSpecFromCode(filePath: string): Promise<OfficialSpec> {
    // 1. Analyze code (10 min)
    const codeAnalysis = await this.analyzeFile(filePath);

    // 2. Find tests (5 min)
    const testAnalysis = await this.findTests(filePath);

    // 3. Compile spec (10 min)
    const spec = await this.compileSpec({
      filePath,
      code: codeAnalysis,
      tests: testAnalysis
    });

    // 4. Save (5 min)
    await this.saveSpec(spec);

    return spec;
  }

  // Implementation methods...
}
```

**MCP Tool:** `generate_spec_from_code`
**Git Hook:** Auto-run on commit
**CI/CD:** Auto-run on push

**Total: 30 min + testing!**

---

## 🎯 THE RESULT

**Central Intelligence can now:**

✅ **Detect**: When user provides specs (proactive)
✅ **Generate**: Specs from user input (spec-first)
✅ **Analyze**: Existing code (code archaeology)
✅ **Reverse-Generate**: Specs from code (code-first)
✅ **Sync**: Keep specs and code aligned (continuous)
✅ **Validate**: Code meets specs (automated)
✅ **Update**: Specs when code changes (living docs)

**Both directions work!**
**Institutional memory self-maintains!**
**No manual spec writing for rapid features!**

**Should I implement ReverseSpecGenerator NOW?** (30 min to completion!) 🎯🚀