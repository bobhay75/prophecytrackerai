#!/bin/bash

# Path to your repository
REPO_PATH="/home/thebobsomest1/trust-ai/projects/prophecytrackerai"
cd "$REPO_PATH" || exit

while true; do
    # Stage all changes
    git add .

    # Commit changes if there are any
    git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || echo "No changes to commit"

    # Pull remote changes first to avoid push conflicts
    git pull --rebase origin main 2>/dev/null || echo "Pull failed, continuing..."

    # Push changes to GitHub
    git push origin main 2>/dev/null || echo "Push failed, retrying in next loop"

    # Log timestamp
    echo "✅ All changes committed and pushed successfully at $(date '+%Y-%m-%d %H:%M:%S')."

    # Wait 5 minutes before next loop
    sleep 300
done

