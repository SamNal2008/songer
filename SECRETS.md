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
