#!/bin/bash

REPO_PATH="/home/thebobsomest1/trust-ai/projects/prophecytrackerai"
cd "$REPO_PATH" || exit

while true; do
    git add .
    git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

    # 🔧 Fix: pull first to avoid rejected pushes
    git pull --rebase origin main

    git push origin main

    echo "✅ All changes committed and pushed successfully at $(date '+%Y-%m-%d %H:%M:%S')."

    # wait 5 minutes before next loop
    sleep 300
done
