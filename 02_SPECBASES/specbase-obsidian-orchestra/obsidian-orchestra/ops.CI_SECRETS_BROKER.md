---
title: "CI Secrets Broker - Secure Credential Management"
type: "operations"
category: "ci_cd"
last_updated: "2025-10-01"
version: "1.0.0"
---

# ops.CI_SECRETS_BROKER - Secure CI/CD Secrets

## Purpose

CI Secrets Broker specification defines secure credential management in CI/CD pipelines using OIDC federation, preventing plaintext secrets in code while enabling automated deployments.

## Architecture

### Secrets Flow

```
GitHub Actions → OIDC Token → Cloud Provider → Secrets Manager → CI Job
      ↓              ↓              ↓                ↓              ↓
   Workflow      JWT Auth      AWS/GCP          Doppler        Env Vars
                              Verifies                        (ephemeral)
```

## Implementation Options

### Option A: Doppler (Recommended)

```yaml
# .github/workflows/deploy.yml
name: Deploy with Doppler Secrets

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Doppler CLI
        uses: dopplerhq/cli-action@v3

      - name: Inject Secrets
        run: doppler run -- npm run deploy
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
          # All secrets injected automatically from Doppler
```

**Doppler Setup:**
```bash
# Configure Doppler
doppler setup --project finops --config production

# Set secrets
doppler secrets set PLUGGY_CLIENT_ID="..." --project finops --config production
doppler secrets set DATABASE_URL="..." --project finops --config production
doppler secrets set KMS_KEY_ID="..." --project finops --config production

# Verify
doppler secrets --project finops --config production
```

### Option B: GitHub OIDC + AWS Secrets Manager

```yaml
# .github/workflows/deploy.yml
name: Deploy with OIDC

permissions:
  id-token: write # Required for OIDC
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::ACCOUNT:role/GitHubActionsRole
          aws-region: us-east-1

      - name: Fetch Secrets from Secrets Manager
        run: |
          aws secretsmanager get-secret-value \
            --secret-id finops/production \
            --query SecretString \
            --output text > .env.production

      - name: Deploy
        run: npm run deploy
```

**AWS IAM Role Trust Policy:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:sub": "repo:ORG/REPO:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

## Security Validation

### Gitleaks - No Plaintext Secrets

```yaml
# .github/workflows/security.yml
name: Security Scan

on: [pull_request]

jobs:
  gitleaks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Fail on Secrets Found
        run: |
          if [ -f gitleaks-report.json ]; then
            echo "❌ Secrets detected in code!"
            cat gitleaks-report.json
            exit 1
          fi
```

### CodeQL - Secret Scanning

```yaml
- name: Initialize CodeQL
  uses: github/codeql-action/init@v2
  with:
    languages: typescript, javascript

- name: Perform CodeQL Analysis
  uses: github/codeql-action/analyze@v2
```

### Snyk - Dependency Vulnerabilities

```yaml
- name: Run Snyk Security Scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high
```

## Success Criteria

| Check | Target | Validation |
|-------|--------|------------|
| No Plaintext Secrets | 100% | Gitleaks passes |
| OIDC Federation Working | 100% | CI jobs succeed |
| Secret Rotation | Quarterly | Doppler/AWS audit |
| Vulnerability Scan | Zero high/critical | Snyk passes |

## Testing Strategy

1. **Gitleaks Test:** Verify no secrets in git history
2. **OIDC Test:** Verify CI can fetch secrets
3. **Deployment Test:** Verify app starts with fetched secrets
4. **Rotation Test:** Rotate secret, verify app still works

---
