#!/bin/bash

REPO_PATH="/home/thebobsomest1/trust-ai/projects/prophecytrackerai"
cd "$REPO_PATH" || exit

LOCKFILE="/tmp/auto-commit-loop.lock"

# Prevent multiple instances
if [ -f "$LOCKFILE" ]; then
    echo "⚠️ Script already running."
    exit 1
fi
touch "$LOCKFILE"

trap "rm -f $LOCKFILE; exit" INT TERM EXIT

while true; do
    git add .
    git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

    git pull --rebase origin main || echo "⚠️ Pull failed"

    git push origin main || echo "⚠️ Push failed"

    echo "✅ All changes committed and pushed at $(date '+%Y-%m-%d %H:%M:%S')"

    sleep 300  # 5 minutes
done
