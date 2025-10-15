#!/bin/bash

# 📊 REPOSITORY MEASUREMENT SCRIPT
# Quantitative analysis for consolidation decisions

REPO_NAME="$1"
if [ -z "$REPO_NAME" ]; then
    echo "Usage: $0 <repository_name>"
    echo "Example: $0 finops"
    exit 1
fi

echo "=== 📊 MEASURING REPOSITORY: $REPO_NAME ==="
echo ""

# Get repository data from GitHub API
REPO_DATA=$(gh api repos/leolech14/"$REPO_NAME" 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Repository $REPO_NAME not found or inaccessible"
    exit 1
fi

# Extract metrics using jq (fallback to grep if jq unavailable)
COMMITS=$(echo "$REPO_DATA" | grep -o '"commits_count":[0-9]*' | cut -d: -f2)
SIZE_KB=$(echo "$REPO_DATA" | grep -o '"size":[0-9]*' | cut -d: -f2)
STARS=$(echo "$REPO_DATA" | grep -o '"stargazers_count":[0-9]*' | cut -d: -f2)
FORKS=$(echo "$REPO_DATA" | grep -o '"forks_count":[0-9]*' | cut -d: -f2)
ISSUES=$(echo "$REPO_DATA" | grep -o '"open_issues_count":[0-9]*' | cut -d: -f2)
WATCHERS=$(echo "$REPO_DATA" | grep -o '"watchers_count":[0-9]*' | cut -d: -f2)
CREATED_AT=$(echo "$REPO_DATA" | grep -o '"created_at":"[^"]*"' | cut -d'"' -f4)
UPDATED_AT=$(echo "$REPO_DATA" | grep -o '"updated_at":"[^"]*"' | cut -d'"' -f4)
PUSHED_AT=$(echo "$REPO_DATA" | grep -o '"pushed_at":"[^"]*"' | cut -d'"' -f4)
DESCRIPTION=$(echo "$REPO_DATA" | grep -o '"description":"[^"]*"' | cut -d'"' -f4)
LANGUAGE=$(echo "$REPO_DATA" | grep -o '"language":"[^"]*"' | cut -d'"' -f4)
PRIVATE=$(echo "$REPO_DATA" | grep -o '"private":[^,]*' | cut -d: -f2)

# Set defaults if values are empty
COMMITS=${COMMITS:-0}
SIZE_KB=${SIZE_KB:-0}
STARS=${STARS:-0}
FORKS=${FORKS:-0}
ISSUES=${ISSUES:-0}
WATCHERS=${WATCHERS:-0}
LANGUAGE=${LANGUAGE:-"None"}

# Convert timestamps to human readable
if [ -n "$CREATED_AT" ]; then
    CREATED_HUMAN=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$CREATED_AT" "+%Y-%m-%d %H:%M" 2>/dev/null || echo "$CREATED_AT")
else
    CREATED_HUMAN="Unknown"
fi

if [ -n "$PUSHED_AT" ]; then
    PUSHED_HUMAN=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$PUSHED_AT" "+%Y-%m-%d %H:%M" 2>/dev/null || echo "$PUSHED_AT")
else
    PUSHED_HUMAN="Unknown"
fi

# Calculate activity score
ACTIVITY_SCORE=0
if [ "$COMMITS" -gt 0 ]; then
    ACTIVITY_SCORE=$((ACTIVITY_SCORE + $(echo "scale=0; $COMMITS * 2" | bc 2>/dev/null || echo $((COMMITS * 2)))))
fi
ACTIVITY_SCORE=$((ACTIVITY_SCORE + STARS * 5))
ACTIVITY_SCORE=$((ACTIVITY_SCORE + FORKS * 3))
ACTIVITY_SCORE=$((ACTIVITY_SCORE + ISSUES * 2))

# Check recent activity (within last 30 days)
if [ -n "$PUSHED_AT" ]; then
    PUSHED_EPOCH=$(date -j -f "%Y-%m-%dT%H:%M:%SZ" "$PUSHED_AT" +%s 2>/dev/null || echo 0)
    CURRENT_EPOCH=$(date +%s)
    DAYS_SINCE_PUSH=$(( (CURRENT_EPOCH - PUSHED_EPOCH) / 86400 ))

    if [ "$DAYS_SINCE_PUSH" -lt 7 ]; then
        ACTIVITY_SCORE=$((ACTIVITY_SCORE + 50))
    elif [ "$DAYS_SINCE_PUSH" -lt 30 ]; then
        ACTIVITY_SCORE=$((ACTIVITY_SCORE + 25))
    elif [ "$DAYS_SINCE_PUSH" -lt 90 ]; then
        ACTIVITY_SCORE=$((ACTIVITY_SCORE + 10))
    fi
fi

# Content analysis
echo "📋 BASIC INFORMATION:"
echo "  Name: $REPO_NAME"
echo "  Description: ${DESCRIPTION:-"No description"}"
echo "  Language: $LANGUAGE"
echo "  Visibility: $([ "$PRIVATE" = "true" ] && echo "Private" || echo "Public")"
echo "  Created: $CREATED_HUMAN"
echo "  Last Push: $PUSHED_HUMAN"
echo ""

echo "📊 ACTIVITY METRICS:"
echo "  Commits: $COMMITS"
echo "  Stars: $STARS"
echo "  Forks: $FORKS"
echo "  Issues: $ISSUES"
echo "  Watchers: $WATCHERS"
echo "  Repository Size: $SIZE_KB KB"
echo ""

echo "🎯 ACTIVITY SCORE: $ACTIVITY_SCORE/100"
echo ""

# Determine recommendation
RECOMMENDATION="DELETE"
REASON=""
if [ "$ACTIVITY_SCORE" -gt 70 ]; then
    RECOMMENDATION="KEEP"
    REASON="High activity score"
elif [ "$ACTIVITY_SCORE" -gt 40 ]; then
    RECOMMENDATION="MERGE"
    REASON="Moderate activity - consider merging"
elif [ "$SIZE_KB" -gt 1000 ]; then
    RECOMMENDATION="KEEP"
    REASON="Large repository with substantial content"
elif [ -n "$DESCRIPTION" ] && [ "$DESCRIPTION" != "No description" ]; then
    RECOMMENDATION="MERGE"
    REASON="Has description - may have value"
fi

echo "🔍 CONSOLIDATION RECOMMENDATION:"
echo "  Action: $RECOMMENDATION"
echo "  Reason: $REASON"
echo ""

# Check for local directory existence
LOCAL_DIR="/Users/lech/PROJECTS_all/PROJECT_${REPO_NAME}"
ALT_DIR="/Users/lech/PROJECTS_all/$REPO_NAME"

if [ -d "$LOCAL_DIR" ]; then
    echo "📁 LOCAL PRESENCE: ✅ Found at $LOCAL_DIR"
elif [ -d "$ALT_DIR" ]; then
    echo "📁 LOCAL PRESENCE: ✅ Found at $ALT_DIR"
else
    echo "📁 LOCAL PRESENCE: ❌ No local directory found"
fi

# Check VM presence
VM_CHECK=$(gcloud compute ssh lech@central-mcp-server --zone=us-central1-a --command="ls /home/lech/PROJECTS_all/ | grep '$REPO_NAME'" 2>/dev/null)
if [ -n "$VM_CHECK" ]; then
    echo "☁️  VM PRESENCE: ✅ Found on Google Cloud VM"
else
    echo "☁️  VM PRESENCE: ❌ Not found on Google Cloud VM"
fi

echo ""
echo "=== 📊 MEASUREMENT COMPLETE ==="