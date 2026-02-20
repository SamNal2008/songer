# Supabase Migrations

This directory contains Supabase database migrations.

## Migration Workflow

1. Always create a new migration for schema changes:
   ```bash
   supabase migration new new_feature_name
   ```

2. Write your SQL in the generated migration file.

3. Apply migrations:
   ```bash
   supabase db push --linked
   ```

## Rules

- Never modify the database directly
- Each migration must be reversible
- Include descriptive comments in migrations
- Test migrations on a staging environment first

## Current Schema

No migrations exist yet. The database is clean.
