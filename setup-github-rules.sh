#!/bin/bash

# Setup GitHub branch protection rules for the main branch
# Usage: ./setup-github-rules.sh

set -e

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if we're in a git repo
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository"
    exit 1
fi

# Get repository info
REPO=$(gh repo view --json nameWithOwner --jq '.nameWithOwner')
echo "🔧 Setting up branch protection rules for $REPO"

# Create required labels first
echo "📋 Creating required labels..."
gh label create frontend-ok --color "28a745" --description "Frontend CI passed" || true
gh label create frontend-failing --color "d73a49" --description "Frontend CI failed" || true
gh label create backend-ok --color "28a745" --description "Backend CI passed" || true
gh label create backend-failing --color "d73a49" --description "Backend CI failed" || true
gh label create model-ok --color "28a745" --description "Model CI passed" || true
gh label create model-pending --color "fbca04" --description "Model CI pending/not configured" || true
gh label create enhancement --color "a2eeef" --description "New feature or request" || true
gh label create bug --color "d73a49" --description "Something isn't working" || true
gh label create ai-task --color "0075ca" --description "Task for AI agents (Codex/Claude)" || true
gh label create codex --color "5319e7" --description "Assigned to Codex agent" || true
gh label create claude --color "ff9800" --description "Assigned to Claude agent" || true
gh label create feedback --color "f9d0c4" --description "Feedback requested" || true
gh label create in-progress --color "fbca04" --description "Currently being worked on" || true
gh label create done --color "28a745" --description "Completed" || true
gh label create needs-revision --color "e99695" --description "Needs revision" || true

# Set up branch protection
echo "🛡️ Setting up branch protection for main branch..."

# Get the branch protection JSON
cat > /tmp/branch-protection.json << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": []
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "require_last_push_approval": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": false
}
EOF

# Apply branch protection
gh api repos/$REPO/branches/main/protection \
  --method PUT \
  --input /tmp/branch-protection.json \
  --silent || {
    echo "⚠️ Failed to set branch protection. Make sure you have admin permissions."
    echo "You may need to run: gh auth refresh -h github.com -s admin:org"
}

# Create repository secrets documentation
echo "📝 Creating repository secrets documentation..."
cat > SECRETS.md << 'EOF'
# Required Repository Secrets

Add these secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):

## Supabase
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key (backend only)
- `SUPABASE_DB_URL`: Direct database URL (for migrations)
- `SUPABASE_ACCESS_TOKEN`: Supabase access token for CLI

## Backend
- `BACKEND_SECRET_KEY`: Secret key for backend (JWT, etc.)

## Model (placeholder)
- `HUGGINGFACE_API_KEY`: HuggingFace API key (when model is chosen)
- `MODEL_NAME`: Name of the model to use

## Deployment
- `VERCEL_TOKEN`: Vercel deployment token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

## Optional
- `SLACK_WEBHOOK_URL`: Slack webhook for deployment notifications
EOF

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add the required secrets (see SECRETS.md)"
echo "2. Review the branch protection rules in GitHub settings"
echo "3. Test the CI/CD pipeline by opening a PR"

# Clean up
rm -f /tmp/branch-protection.json
