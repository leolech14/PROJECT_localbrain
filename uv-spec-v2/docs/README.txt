LocalBrain Front-Matter v2 Fix Pack
Date: 2025-10-15

This pack fixes the YAML front-matter v2 integration issues in the LocalBrain repo:
- ASCII-only linter (no Unicode surprises)
- Migration script to upgrade existing specs
- Git hooks correctly split between pre-commit and commit-msg
- spec.config.json with multiple default globs (edit as needed)

Install (from repo root):
  unzip lb-fm-v2-fixpack.zip -d ./
  npm i -D ajv ajv-formats js-yaml fast-glob
  cp -f hooks/* .git/hooks/ && chmod +x .git/hooks/*
  node scripts/spec_v2_migrate.mjs --spec-root "<spec-dir>" --mode update --category-by-path
  node scripts/uv-spec-lint.mjs

Spec dir examples (choose the one you actually use):
  ISOLATED_APP_PROJECT/source_files/uv-specs-all-2025-10-15/
  ISOLATED_APP_PROJECT/source_files/uv-specs/
  uv-specs-all-2025-10-15/
  uv-specs/

Tip: keep REGISTRY_ENFORCE=1 in your environment if you want pre-commit to require CENTRAL_TASK_REGISTRY.md
updates when code changes are staged. Use ALLOW_NON_TASK_COMMITS=1 to temporarily bypass the commit message rule.
