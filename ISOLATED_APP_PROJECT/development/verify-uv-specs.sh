#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="${1:-./uv-specs}"
SUM_FILE="${2:-./uv-sha256sum.txt}"

if command -v sha256sum >/dev/null 2>&1; then
  # Linux style
  (cd "$(dirname "$SUM_FILE")" && sha256sum -c "$(basename "$SUM_FILE")" --quiet) || (echo "Checksum mismatch" && exit 1)
elif command -v shasum >/dev/null 2>&1; then
  # macOS style
  # Convert lines to 'hash  path' form relative to current dir
  while read -r HASH TWO PATH; do
    FILE="$ROOT_DIR/${PATH#uv-specs/}"
    CALC=$(shasum -a 256 "$FILE" | awk '{print $1}')
    if [[ "$CALC" != "$HASH" ]]; then
      echo "FAIL  $PATH"
      exit 1
    fi
  done < "$SUM_FILE"
else
  echo "Neither sha256sum nor shasum found."
  exit 1
fi
echo "All checksums OK."
