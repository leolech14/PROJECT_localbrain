# 🚦 APCA CI Gate Design

**Version**: 1.0.0
**Created**: 2025-10-08
**Agent**: Agent B (Design System Specialist)
**Status**: DESIGN COMPLETE (awaiting CI pipeline access)

---

## 📋 Overview

This document specifies the design for an automated CI gate that enforces APCA contrast requirements for all design token changes.

### Goals
- **Prevent** non-compliant color pairings from merging
- **Automate** contrast validation in CI/CD pipeline
- **Report** detailed failures with actionable guidance
- **Block** PRs that introduce accessibility violations

---

## 🏗️ Architecture

### CI Pipeline Integration

```
┌──────────────────────────────────────────────────────────┐
│  GitHub Pull Request (design token changes)              │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│  CI Pipeline Trigger (GitHub Actions / CircleCI)        │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│  Install Dependencies (npm install)                      │
│  - apca-w3                                               │
│  - colorjs.io                                            │
└────────────────┬─────────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────────┐
│  Run APCA Validation (npm run validate:tokens)          │
│  - Load design-tokens.json                               │
│  - Validate all color pairings                           │
│  - Generate detailed report                              │
└────────────────┬─────────────────────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
    ┌────────┐      ┌────────┐
    │  PASS  │      │  FAIL  │
    └────┬───┘      └────┬───┘
         │               │
         ▼               ▼
   ✅ Merge        ❌ Block PR
   Allowed         + Post Comment
                   + Show Report
```

---

## 🔧 Implementation Components

### 1. GitHub Actions Workflow

**File**: `.github/workflows/apca-validation.yml`

```yaml
name: APCA Contrast Validation

on:
  pull_request:
    paths:
      - 'design/tokens/**'
      - 'design/apca/**'
  push:
    branches:
      - main

jobs:
  validate-contrast:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd design/apca
          npm install

      - name: Run APCA validation
        id: apca-check
        run: |
          cd design/apca
          npm run validate:tokens > report.txt 2>&1
          echo "report<<EOF" >> $GITHUB_OUTPUT
          cat report.txt >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT
        continue-on-error: true

      - name: Post validation report
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            const report = `${{ steps.apca-check.outputs.report }}`;
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## ❌ APCA Contrast Validation Failed\n\n\`\`\`\n${report}\n\`\`\``
            });

      - name: Fail build if validation fails
        if: steps.apca-check.outcome == 'failure'
        run: exit 1

      - name: Success comment
        if: success()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '## ✅ APCA Contrast Validation Passed\n\nAll design tokens meet accessibility requirements!'
            });
```

---

### 2. NPM Scripts Configuration

Already implemented in `package.json`:

```json
{
  "scripts": {
    "validate": "node validator.js",
    "validate:tokens": "node validate-tokens.js",
    "report": "node generate-report.js"
  }
}
```

---

### 3. Exit Code Behavior

**Success** (all validations pass):
- Exit code: `0`
- PR check: ✅ Pass
- Action: Allow merge

**Failure** (any validation fails):
- Exit code: `1`
- PR check: ❌ Fail
- Action: Block merge + post detailed report

---

## 📊 Validation Report Format

### Pass Example
```
🎨 LocalBrain Design Tokens - APCA Validation Report

======================================================================

📊 VALIDATION RESULTS:

✅ Surface: bg + text (primary)
   Actual: 90.3 | Required: ≥75 | ✅ PASS
   ✨ Surplus: 15.3 points above requirement

✅ Surface: bg + textMuted (secondary)
   Actual: 65.7 | Required: ≥60 | ✅ PASS
   ✨ Surplus: 5.7 points above requirement

...

======================================================================

📈 SUMMARY STATISTICS:

Total Pairings Tested: 18
✅ Passed: 18 (100.0%)
❌ Failed: 0 (0.0%)

🎉 FULL COMPLIANCE: All design tokens meet APCA requirements!
✅ Safe to use in production

======================================================================
```

### Fail Example
```
🎨 LocalBrain Design Tokens - APCA Validation Report

======================================================================

📊 VALIDATION RESULTS:

❌ Surface: bg + textMuted (secondary)
   Actual: 54.2 | Required: ≥60 | ❌ FAIL
   ⚠️  Deficit: 5.8 points below requirement

✅ Accent: bg + text (interactive)
   Actual: 85.1 | Required: ≥75 | ✅ PASS
   ✨ Surplus: 10.1 points above requirement

...

======================================================================

📈 SUMMARY STATISTICS:

Total Pairings Tested: 18
✅ Passed: 17 (94.4%)
❌ Failed: 1 (5.6%)

⚠️  NON-COMPLIANT: 1 token pairing(s) fail APCA requirements
❌ Must fix before production use

======================================================================
```

---

## 🚨 Failure Handling

### PR Comment on Failure

GitHub Actions will automatically post a comment on the PR:

```markdown
## ❌ APCA Contrast Validation Failed

**1 token pairing(s) fail APCA requirements**

### Failed Pairings:

❌ **Surface: bg + textMuted**
- Actual contrast: 54.2
- Required: ≥60
- Deficit: 5.8 points

### Recommendations:

To fix this failure:
1. Increase lightness difference between text and background
2. For `textMuted`, try lightness values between 0.50-0.55
3. Run local validation: `cd design/apca && npm run validate:tokens`
4. Re-test and push changes

### Resources:
- [APCA Calculator](https://www.myndex.com/APCA/)
- [Design Tokens Documentation](../tokens/README.md)
```

---

## 🔒 Branch Protection Rules

### Recommended GitHub Settings

**Branch**: `main`

**Required Status Checks**:
- ✅ `validate-contrast` (APCA validation job)

**Settings**:
- ☑️ Require status checks to pass before merging
- ☑️ Require branches to be up to date before merging
- ☑️ Do not allow bypassing the above settings

**Result**: No one (including admins) can merge non-compliant tokens

---

## ⚙️ Configuration Options

### Custom Thresholds (Future Enhancement)

Create `apca-config.json` for project-specific thresholds:

```json
{
  "thresholds": {
    "body": 60,
    "interactive": 75,
    "small": 75,
    "large": 60
  },
  "strict": true,
  "reportFormat": "detailed"
}
```

### Validation Scope

Can be extended to validate:
- ✅ Design tokens (current)
- 🔄 CSS variables (future)
- 🔄 Component prop combinations (future)
- 🔄 Tailwind config (future)

---

## 📈 Performance Considerations

### Validation Speed

**Expected**: < 5 seconds for full token validation

**Optimization**:
- Cache `npm install` in CI
- Only run on design token changes (path filter)
- Parallel validation for multiple token files (if needed)

### CI Resource Usage

**Compute**: ~30 seconds total CI time
**Cost**: Minimal (GitHub Actions free tier: 2000 min/month)

---

## 🧪 Testing the CI Gate

### Local Testing (Before PR)

```bash
cd design/apca
npm install
npm run validate:tokens
```

**Expected**: Exit code 0 (success) or 1 (failure)

### PR Testing (After Setup)

1. Create branch with token changes
2. Push to GitHub
3. Open PR
4. Observe CI check running
5. See pass/fail status + comment

---

## 📝 Implementation Checklist

### Prerequisites
- [x] APCA validation scripts complete (validator.js, validate-tokens.js)
- [x] Design tokens complete (design-tokens.json)
- [x] NPM scripts configured (package.json)
- [ ] CI pipeline access granted (BLOCKER)

### Setup Tasks (When CI Access Granted)
- [ ] Create `.github/workflows/apca-validation.yml`
- [ ] Test workflow on sample PR
- [ ] Configure branch protection rules
- [ ] Enable required status checks
- [ ] Document CI setup for team

### Validation
- [ ] Trigger CI on token change PR
- [ ] Verify validation runs
- [ ] Verify pass/fail behavior
- [ ] Verify PR comments post correctly
- [ ] Verify merge blocking works

---

## 🚀 Rollout Plan

### Phase 1: Soft Launch (Warning Only)
- CI runs but doesn't block merges
- Team learns the system
- Fine-tune thresholds if needed

### Phase 2: Hard Enforcement
- Enable branch protection
- Block non-compliant PRs
- Full enforcement

### Phase 3: Expansion
- Extend to CSS variables
- Extend to component validation
- Integrate with design tools (Figma plugin)

---

## 📚 References

- [APCA Official Documentation](https://git.apcacontrast.com/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Branch Protection Rules](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

---

**Status**: ✅ DESIGN COMPLETE
**Blocker**: CI Pipeline Access (escalated to Lech via Agent E)
**Next**: Implement workflow when access granted
**ETA**: < 1 hour once CI access available
