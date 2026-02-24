# Explorer Prompt

Map the repo, identify implementation entry points, and flag delivery risks before coding.

## Inputs Required
- Feature/ticket description
- Known target modules (if any)
- Constraints (performance, security, timeline)

## Files Allowed To Touch
- Read-only analysis by default
- Optional: analysis notes under `codex/` only
- No production code edits

## Tasks
1. Map relevant folders and ownership boundaries.
2. Identify concrete entry points (screens, hooks, services, APIs, tests).
3. List dependencies and side effects.
4. Produce risk list with severity and mitigation.

## Output Format
- `Repo Map`: relevant directories/files
- `Entry Points`: exact files/functions to start from
- `Plan`: ordered implementation steps
- `Risks`: severity, impact, mitigation
- `Unknowns`: assumptions requiring confirmation

## Definition Of Done
- Entry points are specific and actionable
- Risks are explicit and prioritized
- Plan is minimal and feasible
- No code was modified outside allowed scope
