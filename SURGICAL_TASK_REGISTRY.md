# 🔫 SURGICAL TASK REGISTRY: MR-FIX-MY-PROJECT-PLEASE.PY
# ULTRATHINK Precision Code Surgery Protocol

**Target File:** mr-fix-my-project-please.py
**Current State:** 792KB, 14,430 lines, 206 functions
**Operation Date:** 2025-10-12
**Surgeon:** Claude Code (Sonnet 4.5)
**Risk Level:** 🔴 HIGH (class boundary violations + runtime bugs)

---

## 📊 OPERATION OVERVIEW

### Critical Path Dependencies
```
LAYER 0 (Foundation):
  T001 → T002 → T003

LAYER 1 (Preparation):
  T004 → T005

LAYER 2 (Surgery):
  T006 → T007 → T008 → T009 → T010 → T011

LAYER 3 (Validation):
  T012 → T013 → T014

LAYER 4 (Cleanup):
  T015 → T016
```

### Success Metrics
- [ ] Zero AttributeError exceptions
- [ ] HTML-only mode generates >100KB output
- [ ] Diagrams show ≥10 nodes, ≥20 edges
- [ ] All 206 functions accessible from call sites
- [ ] Single generate_dependency_analysis() method
- [ ] Python 3.12+ compilation success
- [ ] Execution time <30 seconds on test project

---

## 🎯 TASK REGISTRY

### LAYER 0: FOUNDATION (Backup & Safety)

#### T001: Create Timestamped Backup
**Status:** ⏸️ PENDING
**Priority:** 🔥 CRITICAL
**Dependencies:** None
**Estimated Time:** 30 seconds

**Objective:**
Create safety backup before any surgical edits.

**Commands:**
```bash
cd /Users/lech/PROJECTS_all/LocalBrain

# Create backup with timestamp
cp mr-fix-my-project-please.py \
   mr-fix-my-project-please.BACKUP-$(date +%Y%m%d-%H%M%S).py

# Verify backup exists
ls -lh mr-fix-my-project-please.BACKUP-*.py
```

**Verification:**
```bash
# Check backup size matches original
original_size=$(wc -c < mr-fix-my-project-please.py)
backup_size=$(wc -c < mr-fix-my-project-please.BACKUP-*.py)
[ "$original_size" -eq "$backup_size" ] && echo "✅ Backup verified"
```

**Success Criteria:**
- ✅ Backup file exists
- ✅ Backup size = original size
- ✅ Backup is readable

**Rollback:** N/A (this IS the rollback)

---

#### T002: Verify Python Version
**Status:** ⏸️ PENDING
**Priority:** 🔥 CRITICAL
**Dependencies:** None
**Estimated Time:** 1 minute

**Objective:**
Ensure Python 3.12+ available (nested f-string requirement at L2371).

**Commands:**
```bash
# Check Python version
python3 --version
python3.12 --version 2>/dev/null || echo "⚠️ Python 3.12+ not found"

# Alternative: Check if nested f-strings parse
python3 -c "f\"{f'nested'}\"" 2>/dev/null && echo "✅ Nested f-strings supported"
```

**Verification:**
```bash
# Confirm version
python3 --version | grep -E "3\.(1[2-9]|[2-9][0-9])" && echo "✅ Python 3.12+"
```

**Success Criteria:**
- ✅ Python 3.12+ available OR
- ✅ Alternative Python with nested f-string support

**Rollback:** Install Python 3.12 or plan L2371 fix

---

#### T003: Syntax Pre-Check
**Status:** ⏸️ PENDING
**Priority:** 🔴 HIGH
**Dependencies:** T001, T002
**Estimated Time:** 30 seconds

**Objective:**
Verify current file compiles before modifications.

**Commands:**
```bash
cd /Users/lech/PROJECTS_all/LocalBrain

# Syntax check
python3.12 -m py_compile mr-fix-my-project-please.py

# Check for errors
echo $? # Should be 0
```

**Verification:**
```bash
# Check for .pyc file
ls -la __pycache__/mr-fix-my-project-please*.pyc && echo "✅ Compiles"
```

**Success Criteria:**
- ✅ Exit code 0
- ✅ No syntax errors
- ✅ .pyc file generated

**Rollback:** Fix existing syntax errors before proceeding

---

### LAYER 1: PREPARATION (Analysis & Planning)

#### T004: Identify Method Boundaries
**Status:** ⏸️ PENDING
**Priority:** 🔴 HIGH
**Dependencies:** T003
**Estimated Time:** 5 minutes

**Objective:**
Extract exact line numbers for methods to move from UltraThink to MrFix.

**Commands:**
```bash
cd /Users/lech/PROJECTS_all/LocalBrain

# Find UltraThinkMermaidMaximizer class boundary
grep -n "^class UltraThinkMermaidMaximizer" mr-fix-my-project-please.py

# Find MrFixMyProjectPlease class end
grep -n "^class UltraThinkMermaidMaximizer" mr-fix-my-project-please.py | \
  awk -F: '{print $1-1}'

# Extract methods to move
grep -n "def _scan_source_files\|def _analyze_file_dependencies\|def _build_dependency_graph\|def _calculate_ripple_effects\|def _identify_critical_files" mr-fix-my-project-please.py
```

**Methods to Extract (17 total):**
```
1. _scan_source_files              (L3039)
2. _analyze_file_dependencies      (L3054)
3. _analyze_python_dependencies    (L3072)
4. _analyze_javascript_dependencies (L3103)
5. _analyze_generic_dependencies   (L3139)
6. _build_dependency_graph         (L3160)
7. _calculate_ripple_effects       (L3180)
8. _identify_critical_files        (L3220)
9. _assess_real_risk               (L3243)
10. _classify_dependency           (L3273)
11. _assess_strength               (L3286)
12. _find_indirect_dependencies    (L3295)
13. _count_total_lines             (L3309)
14. _sniper_entity_scan            (L3320)
15. _calculate_function_complexity (L3484)
16. _extract_class_methods         (L3532)
17. _extract_component_props       (L3563)
```

**Verification:**
```bash
# Count methods found
grep -c "def _scan_source_files\|def _analyze_file_dependencies" mr-fix-my-project-please.py
# Should be 1 of each in UltraThink class
```

**Success Criteria:**
- ✅ All 17 methods located
- ✅ Line numbers documented
- ✅ Method signatures extracted

**Rollback:** N/A (read-only analysis)

---

#### T005: Create Extraction Plan
**Status:** ⏸️ PENDING
**Priority:** 🟡 MEDIUM
**Dependencies:** T004
**Estimated Time:** 10 minutes

**Objective:**
Map insertion points in MrFixMyProjectPlease class.

**Commands:**
```bash
# Find MrFix class boundaries
grep -n "^class MrFixMyProjectPlease" mr-fix-my-project-please.py

# Find _build_enhanced_dependency_data method
grep -n "def _build_enhanced_dependency_data" mr-fix-my-project-please.py

# Find method end (next def at same indentation)
awk '/def _build_enhanced_dependency_data/,/^    def / {print NR": "$0}' mr-fix-my-project-please.py | tail -5
```

**Insertion Point:**
- **After:** _build_enhanced_dependency_data ends (~L2310)
- **Before:** UltraThinkMermaidMaximizer class starts (L2656)

**Verification:**
```bash
# Verify insertion zone is empty or has compatible indentation
sed -n '2311,2655p' mr-fix-my-project-please.py | head -20
```

**Success Criteria:**
- ✅ Insertion point identified
- ✅ Indentation level confirmed (4 spaces)
- ✅ No conflicting methods in target zone

**Rollback:** N/A (planning only)

---

### LAYER 2: SURGERY (Code Modifications)

#### T006: Extract Helper Methods Block
**Status:** ⏸️ PENDING
**Priority:** 🔥 CRITICAL
**Dependencies:** T005
**Estimated Time:** 15 minutes

**Objective:**
Extract 17 helper methods from UltraThink class (preserve exact code).

**Method:**
```bash
# Extract methods L3039-L3595 (556 lines)
sed -n '3039,3595p' mr-fix-my-project-please.py > /tmp/helper_methods_block.txt

# Verify extraction
wc -l /tmp/helper_methods_block.txt
# Should be ~556 lines

# Preview first method
head -30 /tmp/helper_methods_block.txt
```

**Extracted Block Contains:**
```python
    def _scan_source_files(self, project_path: Path) -> list:
        """Scan project for source files"""
        # ... (implementation)

    def _analyze_file_dependencies(self, file_path: Path) -> dict:
        """Analyze dependencies in a single file"""
        # ... (implementation)

    # ... 15 more methods
```

**Verification:**
```bash
# Count extracted methods
grep -c "^    def _" /tmp/helper_methods_block.txt
# Should be 17
```

**Success Criteria:**
- ✅ 556 lines extracted
- ✅ 17 methods present
- ✅ Indentation preserved (4 spaces)
- ✅ No truncated methods

**Rollback:**
```bash
rm /tmp/helper_methods_block.txt
```

---

#### T007: Insert Helpers into MrFix Class
**Status:** ⏸️ PENDING
**Priority:** 🔥 CRITICAL
**Dependencies:** T006
**Estimated Time:** 10 minutes

**Objective:**
Insert extracted helpers after _build_enhanced_dependency_data in MrFix.

**Commands:**
```bash
cd /Users/lech/PROJECTS_all/LocalBrain

# Create modified file
head -2310 mr-fix-my-project-please.py > /tmp/mr-fix-modified.py
echo "" >> /tmp/mr-fix-modified.py
cat /tmp/helper_methods_block.txt >> /tmp/mr-fix-modified.py
echo "" >> /tmp/mr-fix-modified.py
tail -n +2311 mr-fix-my-project-please.py >> /tmp/mr-fix-modified.py

# Verify line count
wc -l mr-fix-my-project-please.py /tmp/mr-fix-modified.py
# Modified should be ~556 lines longer
```

**Verification:**
```bash
# Check methods now in MrFix
grep -n "class MrFixMyProjectPlease" /tmp/mr-fix-modified.py
grep -n "def _scan_source_files" /tmp/mr-fix-modified.py
# Should show new location ~L2312

# Syntax check
python3.12 -m py_compile /tmp/mr-fix-modified.py
```

**Success Criteria:**
- ✅ File compiles
- ✅ Line count increases by ~556
- ✅ Methods in MrFix class
- ✅ Methods still in UltraThink (not yet deleted)

**Rollback:**
```bash
rm /tmp/mr-fix-modified.py
```

---

#### T008: Delete Duplicate Helpers from UltraThink
**Status:** ⏸️ PENDING
**Priority:** 🔴 HIGH
**Dependencies:** T007
**Estimated Time:** 10 minutes

**Objective:**
Remove helper methods from UltraThink class (now duplicated in MrFix).

**Commands:**
```bash
# Calculate new UltraThink start line (original + 556)
# UltraThink was at L2656, now at L3212 (2656 + 556)

# Remove L3595-4151 (old helper block, adjusted for shift)
head -3594 /tmp/mr-fix-modified.py > /tmp/mr-fix-modified2.py
tail -n +4152 /tmp/mr-fix-modified.py >> /tmp/mr-fix-modified2.py

# Verify
wc -l /tmp/mr-fix-modified.py /tmp/mr-fix-modified2.py
# Should be 556 lines shorter
```

**Verification:**
```bash
# Check helpers gone from UltraThink
grep -n "class UltraThinkMermaidMaximizer" /tmp/mr-fix-modified2.py
grep -A 50 "class UltraThinkMermaidMaximizer" /tmp/mr-fix-modified2.py | \
  grep "_scan_source_files"
# Should find ZERO matches

# Syntax check
python3.12 -m py_compile /tmp/mr-fix-modified2.py
```

**Success Criteria:**
- ✅ File compiles
- ✅ Helpers only in MrFix
- ✅ Helpers removed from UltraThink
- ✅ Line count back to ~14,430

**Rollback:**
```bash
cp /tmp/mr-fix-modified.py /tmp/mr-fix-modified2.py
```

---

#### T009: Replace Simple generate_dependency_analysis
**Status:** ⏸️ PENDING
**Priority:** 🔥 CRITICAL
**Dependencies:** T008
**Estimated Time:** 15 minutes

**Objective:**
Replace MrFix's simple generate_dependency_analysis with comprehensive version.

**Method:**
```bash
# Find simple version in MrFix (original L1719)
grep -n "def generate_dependency_analysis" /tmp/mr-fix-modified2.py | head -1

# Find comprehensive version in UltraThink
grep -n "def generate_dependency_analysis" /tmp/mr-fix-modified2.py | tail -1

# Extract comprehensive version (94 lines, from UltraThink)
# Adjusted line numbers after previous operations
sed -n 'XXXX,YYYYp' /tmp/mr-fix-modified2.py > /tmp/comprehensive_analysis.txt
```

**Steps:**
1. Extract comprehensive version from UltraThink
2. Delete simple version from MrFix (L1719-1831, ~113 lines)
3. Insert comprehensive version at L1719
4. Delete duplicate from UltraThink

**Verification:**
```bash
# Check only ONE generate_dependency_analysis
grep -c "def generate_dependency_analysis" /tmp/mr-fix-modified3.py
# Should be 1

# Verify it's the comprehensive one (uses helpers)
grep -A 20 "def generate_dependency_analysis" /tmp/mr-fix-modified3.py | \
  grep "_scan_source_files"
# Should find match
```

**Success Criteria:**
- ✅ Single generate_dependency_analysis exists
- ✅ Located in MrFix class
- ✅ Uses helper methods
- ✅ File compiles

**Rollback:**
```bash
cp /tmp/mr-fix-modified2.py /tmp/mr-fix-modified3.py
```

---

#### T010: Fix Path Type Mismatch
**Status:** ⏸️ PENDING
**Priority:** 🔴 HIGH
**Dependencies:** T009
**Estimated Time:** 5 minutes

**Objective:**
Fix _build_enhanced_dependency_data L2253 str→Path conversion.

**Current Code (L2253):**
```python
deps = self._analyze_file_dependencies(file_path_str)
```

**Fixed Code:**
```python
from pathlib import Path
deps = self._analyze_file_dependencies(Path(file_path_str))
```

**Commands:**
```bash
# Find exact line
grep -n "deps = self._analyze_file_dependencies(file_path_str)" /tmp/mr-fix-modified3.py

# Replace (sed)
sed -i.bak 's/deps = self\._analyze_file_dependencies(file_path_str)/deps = self._analyze_file_dependencies(Path(file_path_str))/' /tmp/mr-fix-modified3.py

# Verify Path import exists at top
head -50 /tmp/mr-fix-modified3.py | grep "from pathlib import Path"
```

**Verification:**
```bash
# Check fix applied
grep -A 2 "deps = self._analyze_file_dependencies" /tmp/mr-fix-modified3.py

# Syntax check
python3.12 -m py_compile /tmp/mr-fix-modified3.py
```

**Success Criteria:**
- ✅ Path() wrapper added
- ✅ pathlib imported
- ✅ File compiles
- ✅ No AttributeError on Path methods

**Rollback:**
```bash
mv /tmp/mr-fix-modified3.py.bak /tmp/mr-fix-modified3.py
```

---

#### T011: Add UltraThink Stub (Safety)
**Status:** ⏸️ PENDING
**Priority:** 🟡 MEDIUM
**Dependencies:** T009
**Estimated Time:** 5 minutes

**Objective:**
Add NotImplementedError stub in UltraThink to prevent future misuse.

**Code to Add:**
```python
    def generate_dependency_analysis(self) -> dict:
        """
        ⚠️ DEPRECATED: This method has been moved to MrFixMyProjectPlease.
        UltraThink should only handle diagram rendering.
        """
        raise NotImplementedError(
            "generate_dependency_analysis has been moved to MrFixMyProjectPlease. "
            "Please call fixer.generate_dependency_analysis() instead."
        )
```

**Commands:**
```bash
# Find UltraThink class start
grep -n "class UltraThinkMermaidMaximizer" /tmp/mr-fix-modified3.py

# Insert stub after class definition
# Use sed or manual edit
```

**Verification:**
```bash
# Check stub exists
grep -A 5 "DEPRECATED: This method" /tmp/mr-fix-modified3.py

# Syntax check
python3.12 -m py_compile /tmp/mr-fix-modified3.py
```

**Success Criteria:**
- ✅ Stub raises NotImplementedError
- ✅ Clear error message
- ✅ File compiles

**Rollback:** Remove stub method

---

### LAYER 3: VALIDATION (Testing & Verification)

#### T012: Syntax Validation
**Status:** ⏸️ PENDING
**Priority:** 🔥 CRITICAL
**Dependencies:** T011
**Estimated Time:** 2 minutes

**Objective:**
Verify modified file has no syntax errors.

**Commands:**
```bash
# Compile check
python3.12 -m py_compile /tmp/mr-fix-modified3.py

# Import check
python3.12 -c "
import importlib.util
spec = importlib.util.spec_from_file_location('m', '/tmp/mr-fix-modified3.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
print('✅ Module imports successfully')
"
```

**Verification:**
```bash
# Check exit codes
echo $? # Should be 0

# Verify .pyc created
ls -la __pycache__/*mr-fix-modified3*.pyc
```

**Success Criteria:**
- ✅ Exit code 0
- ✅ No SyntaxError
- ✅ Module imports
- ✅ .pyc file generated

**Rollback:** Return to T010 output

---

#### T013: Method Accessibility Test
**Status:** ⏸️ PENDING
**Priority:** 🔥 CRITICAL
**Dependencies:** T012
**Estimated Time:** 3 minutes

**Objective:**
Verify all helper methods accessible from MrFix.

**Commands:**
```bash
python3.12 << 'EOF'
import importlib.util
spec = importlib.util.spec_from_file_location("m", "/tmp/mr-fix-modified3.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

fixer = module.MrFixMyProjectPlease('.')

methods = [
    '_scan_source_files',
    '_analyze_file_dependencies',
    '_build_dependency_graph',
    '_calculate_ripple_effects',
    '_identify_critical_files',
    '_assess_real_risk',
    '_classify_dependency',
    '_assess_strength',
    '_find_indirect_dependencies',
    '_count_total_lines',
    '_sniper_entity_scan',
    '_calculate_function_complexity',
    '_extract_class_methods',
    '_extract_component_props',
]

print("Method Accessibility Check:")
for method in methods:
    has_it = hasattr(fixer, method)
    status = "✅" if has_it else "❌"
    print(f"  {status} {method}: {has_it}")

all_present = all(hasattr(fixer, m) for m in methods)
print(f"\n{'✅ All methods accessible' if all_present else '❌ Missing methods'}")
EOF
```

**Verification:**
```bash
# All checks should pass
# If any fail, identify missing methods
```

**Success Criteria:**
- ✅ All 14+ helper methods found
- ✅ No AttributeError when accessing
- ✅ Methods callable from MrFix instance

**Rollback:** Review T007-T008 for missing methods

---

#### T014: Functional Test (HTML-Only Mode)
**Status:** ⏸️ PENDING
**Priority:** 🔥 CRITICAL
**Dependencies:** T013
**Estimated Time:** 5 minutes

**Objective:**
Run HTML-only mode and verify non-empty diagrams.

**Commands:**
```bash
# Copy modified file to working location
cp /tmp/mr-fix-modified3.py /tmp/mr-fix-test.py

# Create test directory
mkdir -p /tmp/test-project
cd /tmp/test-project

# Create sample files
cat > test.py << 'PYEOF'
import os
from pathlib import Path

def analyze():
    return Path.cwd()
PYEOF

cat > test.js << 'JSEOF'
import React from 'react';
export const App = () => <div>Test</div>;
JSEOF

# Run analysis
cd /tmp
python3.12 mr-fix-test.py test-project --html-only

# Check output
ls -lh test-project*.html
```

**Verification:**
```bash
# Check HTML size
size=$(wc -c < test-project*.html)
[ $size -gt 100000 ] && echo "✅ HTML > 100KB" || echo "❌ HTML too small"

# Check for populated diagrams (search for "0 nodes")
grep "0 nodes" test-project*.html && echo "❌ Empty diagrams" || echo "✅ Diagrams populated"

# Check for entity data
grep -c "entity" test-project*.html
# Should be > 0
```

**Success Criteria:**
- ✅ HTML file generated
- ✅ File size > 100KB
- ✅ Diagrams show >0 nodes
- ✅ No "No data available" messages
- ✅ Execution completes without errors

**Rollback:** Report errors, return to T010

---

### LAYER 4: CLEANUP (Deployment)

#### T015: Deploy Modified File
**Status:** ⏸️ PENDING
**Priority:** 🟡 MEDIUM
**Dependencies:** T014
**Estimated Time:** 2 minutes

**Objective:**
Replace original file with surgically modified version.

**Commands:**
```bash
cd /Users/lech/PROJECTS_all/LocalBrain

# Final backup (paranoid safety)
cp mr-fix-my-project-please.py \
   mr-fix-my-project-please.BEFORE-SURGERY-$(date +%Y%m%d-%H%M%S).py

# Deploy
cp /tmp/mr-fix-modified3.py mr-fix-my-project-please.py

# Verify
ls -lh mr-fix-my-project-please.py
```

**Verification:**
```bash
# Quick smoke test
python3.12 -m py_compile mr-fix-my-project-please.py
echo $?
```

**Success Criteria:**
- ✅ Original backed up
- ✅ Modified file in place
- ✅ File compiles
- ✅ Permissions preserved

**Rollback:**
```bash
cp mr-fix-my-project-please.BEFORE-SURGERY-*.py mr-fix-my-project-please.py
```

---

#### T016: Final Integration Test
**Status:** ⏸️ PENDING
**Priority:** 🔴 HIGH
**Dependencies:** T015
**Estimated Time:** 10 minutes

**Objective:**
Test both HTML-only and normal modes on real project.

**Commands:**
```bash
cd /Users/lech/PROJECTS_all/LocalBrain

# Test HTML-only mode
python3.12 mr-fix-my-project-please.py . --html-only
ls -lh LocalBrain*.html

# Test normal mode
python3.12 mr-fix-my-project-please.py .
ls -lh maximum_extraction_report.html
```

**Verification:**
```bash
# HTML-only checks
size=$(wc -c < LocalBrain*.html)
[ $size -gt 200000 ] && echo "✅ HTML-only: Good size" || echo "⚠️ Check output"

grep "nodes:" LocalBrain*.html | grep -v "0 nodes" && echo "✅ Diagrams populated"

# Normal mode checks
size=$(wc -c < maximum_extraction_report.html)
[ $size -gt 1000000 ] && echo "✅ Full report generated"

# Check for errors in output
grep -i "error\|exception\|failed" LocalBrain*.html
```

**Success Criteria:**
- ✅ HTML-only mode: 200KB+ with populated diagrams
- ✅ Normal mode: 1MB+ full report
- ✅ No errors in HTML output
- ✅ Execution time <30 seconds each
- ✅ All sections populated (no "No data available")

**Rollback:**
```bash
# If tests fail
cp mr-fix-my-project-please.BEFORE-SURGERY-*.py mr-fix-my-project-please.py
# Report issues for investigation
```

---

## 📊 TASK SUMMARY

| Layer | Tasks | Priority | Total Time | Dependencies |
|-------|-------|----------|------------|--------------|
| 0: Foundation | T001-T003 | CRITICAL | 2 min | None |
| 1: Preparation | T004-T005 | HIGH | 15 min | T003 |
| 2: Surgery | T006-T011 | CRITICAL | 60 min | T005 |
| 3: Validation | T012-T014 | CRITICAL | 10 min | T011 |
| 4: Cleanup | T015-T016 | MEDIUM | 12 min | T014 |
| **TOTAL** | **16 tasks** | - | **~99 min** | Sequential |

---

## 🎯 EXECUTION CHECKLIST

### Pre-Operation
- [ ] Python 3.12+ available
- [ ] Original file backed up
- [ ] Working directory clean
- [ ] No uncommitted git changes

### Operation Progress
- [ ] T001: Backup created ✅
- [ ] T002: Python version verified ✅
- [ ] T003: Syntax pre-check passed ✅
- [ ] T004: Method boundaries identified ✅
- [ ] T005: Extraction plan created ✅
- [ ] T006: Helper methods extracted ✅
- [ ] T007: Helpers inserted into MrFix ✅
- [ ] T008: Duplicates removed from UltraThink ✅
- [ ] T009: Comprehensive analysis deployed ✅
- [ ] T010: Path type mismatch fixed ✅
- [ ] T011: Safety stub added ✅
- [ ] T012: Syntax validation passed ✅
- [ ] T013: Method accessibility verified ✅
- [ ] T014: Functional test passed ✅
- [ ] T015: Modified file deployed ✅
- [ ] T016: Integration tests passed ✅

### Post-Operation
- [ ] HTML-only mode generates >200KB
- [ ] Diagrams show ≥10 nodes, ≥20 edges
- [ ] Normal mode generates >1MB report
- [ ] No AttributeError exceptions
- [ ] All sections populated
- [ ] Execution time <30 seconds

---

## 🚨 EMERGENCY PROCEDURES

### If Syntax Error During Operation
```bash
# Stop immediately
# Restore from most recent backup
cp /tmp/mr-fix-modified[N-1].py /tmp/mr-fix-modified[N].py
# Review failed step
# Fix issue manually
# Continue from fixed state
```

### If Test Failure (T014 or T016)
```bash
# Don't deploy (stop at T014)
# Capture error logs
python3.12 mr-fix-test.py test-project --html-only 2>&1 | tee error.log
# Review error.log
# Identify missing methods or logic errors
# Return to appropriate surgery task
```

### If Production Failure (After T015)
```bash
# Immediate rollback
cp mr-fix-my-project-please.BEFORE-SURGERY-*.py mr-fix-my-project-please.py
# Verify rollback
python3.12 mr-fix-my-project-please.py . --html-only
# Report issue
# Plan corrective surgery
```

---

## 📈 SUCCESS METRICS

### Code Quality
- **Before:** 2 duplicate methods, 17 misplaced helpers
- **After:** 1 comprehensive method, all helpers in correct class

### Functionality
- **Before:** Empty diagrams (0 nodes, 0 edges)
- **After:** Populated diagrams (10+ nodes, 20+ edges)

### Output Size
- **Before:** 23KB HTML (broken)
- **After:** 200-500KB HTML (working)

### Execution
- **Before:** AttributeError exceptions swallowed
- **After:** Clean execution, no exceptions

### Architecture
- **Before:** Boundary violations (analysis in rendering class)
- **After:** Clean boundaries (analysis in analysis class)

---

**Registry Created:** 2025-10-12
**Target Completion:** 2025-10-12 (same day)
**Estimated Duration:** 99 minutes (~1.5 hours)
**Risk Assessment:** MEDIUM (with proper backups and testing)
**Rollback Strategy:** Multiple backup points, layer-by-layer restoration

🔫 **READY FOR SURGICAL OPERATION** 🔫
