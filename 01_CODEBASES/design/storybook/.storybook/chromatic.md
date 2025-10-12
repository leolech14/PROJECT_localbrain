# Visual Regression Testing with Chromatic

## Overview

Chromatic provides automated visual regression testing for Storybook. Every story becomes a visual test case.

## Setup

### 1. Install Chromatic

```bash
npm install --save-dev chromatic
```

### 2. Create Chromatic Account

1. Visit [chromatic.com](https://www.chromatic.com/)
2. Sign in with GitHub
3. Add your LocalBrain repository
4. Copy your project token

### 3. Configure Chromatic

Add to `package.json`:

```json
{
  "scripts": {
    "chromatic": "chromatic --project-token=<your-token>"
  }
}
```

**Security**: Store token in environment variable:

```bash
# .env.local
CHROMATIC_PROJECT_TOKEN=your-token-here
```

```json
{
  "scripts": {
    "chromatic": "chromatic"
  }
}
```

## Usage

### Run Visual Tests Locally

```bash
npm run chromatic
```

This will:
1. Build your Storybook
2. Upload snapshots to Chromatic
3. Compare against baseline
4. Report visual changes

### CI/CD Integration

Add to GitHub Actions (`.github/workflows/chromatic.yml`):

```yaml
name: Chromatic

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  chromatic:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Required for turbosnap

      - name: Install dependencies
        run: npm ci

      - name: Run Chromatic
        uses: chromaui/action@v1
        with:
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          exitZeroOnChanges: true  # Don't fail PR on visual changes
          exitOnceUploaded: true   # Speed up CI
          onlyChanged: true        # Only test changed stories (turbosnap)
```

### PR Workflow

1. **Developer makes UI changes** → Pushes branch
2. **Chromatic runs** → Compares with baseline
3. **Visual changes detected** → Chromatic adds PR comment
4. **Team reviews** → Accepts or rejects changes
5. **Baseline updated** → Merged to main

## Configuration

### Story Parameters

Control visual testing per story:

```typescript
export const MyStory: Story = {
  parameters: {
    chromatic: {
      // Disable visual regression for this story
      disableSnapshot: true,

      // Wait for specific time before snapshot
      delay: 300,

      // Pause animations before snapshot
      pauseAnimationAtEnd: true,

      // Custom viewport sizes
      viewports: [320, 768, 1200],

      // Diff threshold (0-1, higher = more tolerant)
      diffThreshold: 0.2,
    },
  },
};
```

### Global Configuration

Configure in `.storybook/main.ts`:

```typescript
const config: StorybookConfig = {
  // ... other config

  features: {
    buildStoriesJson: true,  // Required for Chromatic
  },
};
```

## Best Practices

### ✅ DO:

1. **Run Chromatic on every PR** - Catch regressions early
2. **Review visual changes carefully** - Don't blindly accept
3. **Use meaningful story names** - Helps identify what changed
4. **Test multiple viewports** - Mobile, tablet, desktop
5. **Test interactive states** - Hover, focus, active, disabled
6. **Pause animations** - For consistent snapshots
7. **Accept intentional changes** - Update baselines when appropriate

### ❌ DON'T:

1. **Don't ignore visual changes** - Investigate every change
2. **Don't test random data** - Use fixed data for consistent snapshots
3. **Don't test external content** - Images, ads, dynamic content
4. **Don't snapshot loading states** - Unless testing loading UI specifically
5. **Don't test animations mid-frame** - Pause at start or end
6. **Don't skip mobile viewports** - Mobile matters!

## Turbosnap (Advanced)

Only snapshot changed stories to speed up CI:

```yaml
- name: Run Chromatic
  uses: chromaui/action@v1
  with:
    projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
    onlyChanged: true  # Turbosnap enabled
```

**Requirements**:
- Full git history (`fetch-depth: 0`)
- Consistent branch naming
- Working branch protection rules

## Debugging

### Common Issues

#### Issue: "No stories found"
**Solution**: Ensure Storybook builds successfully locally first

#### Issue: "Snapshots differ on CI but not locally"
**Solution**: Use Docker for consistent rendering across environments

#### Issue: "Flaky visual tests"
**Solution**:
- Pause animations (`pauseAnimationAtEnd: true`)
- Use fixed data (no random values)
- Add delay before snapshot (`delay: 300`)

#### Issue: "Too many false positives"
**Solution**: Increase `diffThreshold` or use `disableSnapshot` for flaky stories

## Pricing

- **Free tier**: 5,000 snapshots/month
- **Team tier**: $149/month - Unlimited snapshots
- **Enterprise**: Custom pricing

**LocalBrain recommendation**: Start with free tier, upgrade as needed.

## Alternatives

### Percy (Alternative to Chromatic)

**Pros**:
- More flexible (works with any testing framework)
- Better diff visualization
- Stronger GitHub integration

**Cons**:
- Requires manual integration (no @storybook addon)
- More expensive ($249/month for unlimited)
- Slower snapshot processing

**Setup**:

```bash
npm install --save-dev @percy/cli @percy/storybook
```

```json
{
  "scripts": {
    "percy": "percy storybook http://localhost:6006"
  }
}
```

## Monitoring

### Metrics to Track

1. **Visual change frequency** - How often UI changes
2. **False positive rate** - Flaky tests that need fixing
3. **Review time** - How long to accept/reject changes
4. **Coverage** - % of components with visual tests

### Chromatic Dashboard

- View all snapshots
- Compare baselines
- Track coverage
- Monitor build times
- Review team activity

---

## Next Steps

1. ✅ **Create Chromatic account** - Get project token
2. ✅ **Add token to GitHub Secrets** - Secure storage
3. ✅ **Create GitHub Actions workflow** - Automate testing
4. ✅ **Run first build** - Establish baseline
5. ✅ **Review baselines** - Ensure quality
6. ✅ **Enable branch protection** - Require Chromatic checks
7. ✅ **Document workflow** - Team training

---

**Status**: Ready for implementation
**Time estimate**: 2 hours (account setup + CI integration)
**Priority**: High (T016 acceptance criteria)
