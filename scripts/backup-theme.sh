#!/usr/bin/env bash
# Snapshot Theme Editor-owned JSON files from the live theme.
# These files are normally .shopifyignore'd to prevent accidental overwrites,
# so we pull them explicitly for local backup / git history.

set -euo pipefail

cd "$(dirname "$0")/.."

echo "Pulling Theme Editor JSON from live theme…"
shopify theme pull --live \
  --only templates/*.json \
  --only sections/*.json \
  --only config/settings_data.json

echo
echo "Done. Review changes with: git status"
echo "Commit with:  git add templates sections config && git commit -m 'Theme snapshot'"
