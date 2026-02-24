# Reviewer Gate Prompt

Run a blocking review focused on release safety.

## Inputs Required
- PR/ticket context and acceptance criteria
- Changed files / diff
- Required checks and environments

## Files Allowed To Touch
- Read-only review by default
- Optional: minimal fix commits only for critical blockers
- Never add secrets or bypass controls

## Blocking Criteria
1. Secrets: credentials/tokens/keys committed or exposed.
2. Permissions: unsafe auth/RLS/ACL changes without justification.
3. Build integrity: build/typecheck failures.
4. Quality gate: lint/tests failing or missing for changed behavior.
5. Instrumentation: missing error monitoring/analytics where required.

## Output Format
- `Verdict`: `PASS` or `BLOCK`
- `Blocking Findings`: severity, file, rationale, required fix
- `Non-Blocking Findings`: recommendations
- `Verification Logs`: commands and results
- `Risk Signoff`: residual risk statement

## Definition Of Done
- All blocking findings resolved or explicitly accepted by owner
- Verification commands recorded
- Verdict issued with clear merge recommendation
