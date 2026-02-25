# Mobile MCP POC

## Goal

Provide a minimal, credential-free shape for running a Mobile MCP smoke check against a local or CI-provisioned simulator/emulator.

## What This POC Is

- A lightweight starting point for agent-driven mobile checks.
- A template for wiring device boot + MCP server startup + scripted tool calls.

## What This POC Is Not

- Not a production-ready mobile automation suite.
- Not configured with real credentials, API keys, signing identities, or device secrets.

## CI Usage (No Secrets)

Typical CI job shape:

1. Install Node and project dependencies.
2. Provision and boot one target:
   - Android emulator in CI is usually easiest to standardize.
   - iOS simulator is possible on macOS runners.
3. Build or install a test app binary for that target.
4. Start Mobile MCP server with `npx -y @mobilenext/mobile-mcp@latest`.
5. Run an agent/client script that performs a small deterministic smoke flow.
6. Upload logs/artifacts and fail job only on stable, agreed assertions.

No secret material is required for this POC itself.

## Local Simulator/Emulator Connectivity

- Android: ensure `adb` can list the emulator/device before running MCP workflows.
- iOS simulator: ensure simulator is booted and visible to host tooling.
- Real devices are intentionally out of scope for this initial POC because setup is heavier and less CI-friendly.

## Example Invocation

Use the placeholder script in this folder:

```bash
bash tools/mobile-mcp-poc/run-mobile-mcp-poc.sh
```

This script shows expected command shape only and does not execute a real test flow by default.
