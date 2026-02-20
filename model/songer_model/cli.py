"""CLI interface for the model service."""

from __future__ import annotations

import argparse
import sys


def main() -> None:
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(description="Songer Model CLI")
    parser.add_argument(
        "command",
        choices=["health-check"],
        help="Command to run",
    )
    
    args = parser.parse_args()
    
    if args.command == "health-check":
        print("✅ Model service is healthy (placeholder)")
        sys.exit(0)
    else:
        parser.print_help()
        sys.exit(1)
