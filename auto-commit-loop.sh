#!/bin/bash

REPO_PATH="/home/thebobsomest1/trust-ai/projects/prophecytrackerai"
cd "$REPO_PATH" || exit

while true; do
    # Stage all changes
    git add .

    # Commit changes (skip if no changes)
    git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"

    # Ensure we are up to date before pushing
    git stash push -m "auto-stash" --include-untracked || true
    git pull --rebase origin main || true
    git stash pop || true

    # Push changes
    git push origin main

    echo "✅ All changes committed and pushed successfully at $(date '+%Y-%m-%d %H:%M:%S')."

    # Wait 5 minutes
    sleep 300
done

