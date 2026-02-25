# Mobile MCP Spike (`mobile-next/mobile-mcp`)

## Purpose

This document summarizes whether `mobile-next/mobile-mcp` is a good fit for our Expo/React Native testing and agent-driven validation workflow.

## What It Is

`mobile-next/mobile-mcp` is an MCP server for mobile automation that lets agents interact with iOS/Android apps by exposing device listing, app lifecycle controls, UI snapshots, taps, typing, swipes, and assertions through MCP tools.

## Supported Targets

From the project docs and examples:

- iOS simulator
- iOS physical device
- Android emulator
- Android physical device

Notes from upstream docs:

- iOS physical-device flows require additional host tooling (`go-ios`) and manual port-forward/tunnel setup today.
- Android physical-device flows require ADB availability and USB debugging.
- iOS simulator flows rely on WebDriverAgent (WDA) being available.

## Fit For Our Expo/React Native App

For Songer, Mobile MCP can cover black-box UX validation over the built app binary in environments where UI-level device automation is needed:

- Validate the primary "Identify Song" interaction path.
- Validate fallback routing (humming flow, retry states).
- Validate core navigation and key screen rendering on mobile runtime targets (instead of web-only validation).

This complements, not replaces:

- Unit tests and hook/component tests.
- Existing lint/type/build gates.
- Any API/service-level integration tests.

## Risks And Limitations

- Host setup complexity: Appium + drivers + platform SDK/device tooling must exist on the runner.
- iOS real-device setup is currently more operationally heavy than simulator/emulator.
- Environment drift risk in CI (simulator/emulator availability and boot state) can produce flaky runs if not standardized.
- Tooling maturity risk: upstream docs still include manual steps for some targets, so we should keep scope narrow at first.
- Cost/time risk: full end-to-end mobile UI automation for every PR can increase CI duration.

## Recommended Use-Cases

Use Mobile MCP first for targeted, stable smoke coverage:

- PR smoke path on one Android emulator target.
- Nightly deeper path on one iOS simulator + one Android emulator.
- Agent-assisted repro scripts for production bugs (repeatable navigation and evidence capture).
- Pre-release confidence pass for critical user journeys.

Avoid initially:

- Broad matrix testing across many OS/device variants.
- Real-device CI gating until simulator/emulator runs are consistently stable.

## Suggested Rollout

1. Start with a minimal POC runner in CI on a single emulator target.
2. Keep checks informational for the first phase (non-blocking) while measuring flake rate.
3. Promote to required CI check only after stability is demonstrated.

## Sources

- `mobile-next/mobile-mcp` README: https://github.com/mobile-next/mobile-mcp
- `mobile-next/mobile-mcp` docs/wiki: https://github.com/mobile-next/mobile-mcp/wiki
- Context7 library docs (`/mobile-next/mobile-mcp`): https://context7.com/mobile-next/mobile-mcp
