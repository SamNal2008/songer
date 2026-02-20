# Supabase Migrations

This directory contains Supabase database migrations.

## Migration Workflow

1. **Create a new migration**:
   ```bash
   supabase migration new <migration_name>
   ```

2. **Write your SQL** in the generated file in `supabase/migrations/`

3. **Apply migrations**:
   ```bash
   supabase db push --linked
   ```

4. **Reset local database** (if needed):
   ```bash
   supabase db reset --linked
   ```

## Important Rules

- **Never modify the database directly** - always use migrations
- Each migration must be reversible
- Test migrations on a local Supabase instance first
- Include descriptive comments in each migration file

## Current Schema

TODO: Add schema documentation here as migrations are created.
