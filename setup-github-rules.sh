#!/bin/bash
# Setup GitHub branch protection rules for the main branch

set -e

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed. Please install it first."
    echo "See: https://cli.github.com/manual/installation"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo "Error: Not authenticated with GitHub CLI. Run 'gh auth login' first."
    exit 1
fi

# Get repository information
REPO_OWNER=$(gh api user --jq '.login')
REPO_NAME=$(basename "$(git rev-parse --show-toplevel)")
FULL_REPO="$REPO_OWNER/$REPO_NAME"

echo "Setting up branch protection for $FULL_REPO..."

# Create branch protection rule
gh api \
  --method PUT \
  "repos/$FULL_REPO/branches/main/protection" \
  --field required_status_checks='{
    "strict": true,
    "contexts": []
  }' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "require_last_push_approval": false
  }' \
  --field restrictions=null \
  --field allow_force_pushes=false \
  --field allow_deletions=false

echo "✅ Branch protection rules applied to main branch"
echo ""
echo "Note: You'll need to manually configure the required status checks in GitHub settings:"
echo "  - ci-frontend (only if frontend files changed)"
echo "  - ci-backend (only if backend files changed)"
echo "  - ci-model is NOT required (placeholder service)"
echo ""
echo "Visit: https://github.com/$FULL_REPO/settings/branches"
