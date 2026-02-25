#!/usr/bin/env bash
set -euo pipefail

# Placeholder script to document expected invocation shape.
# This file is intentionally non-destructive and does not require secrets.

echo "== Mobile MCP POC (placeholder) =="
echo
echo "1) Ensure a simulator/emulator is booted and reachable."
echo "2) Start MCP server (example):"
echo "   npx -y @mobilenext/mobile-mcp@latest"
echo
echo "3) In another process, run your MCP client/agent flow, for example:"
echo "   - list devices"
echo "   - install app build (apk/app/ipa depending on target)"
echo "   - launch app bundle/package"
echo "   - execute a small smoke interaction path"
echo
echo "This script is a shape reference only. No commands executed."

if [[ "${RUN_EXAMPLE:-0}" == "1" ]]; then
  echo
  echo "RUN_EXAMPLE=1 set; starting Mobile MCP server for manual testing..."
  exec npx -y @mobilenext/mobile-mcp@latest
fi
