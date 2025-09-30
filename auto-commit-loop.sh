#!/bin/bash

# Path to your repository
REPO_PATH="/home/thebobsomest1/trust-ai/projects/prophecytrackerai"
cd "$REPO_PATH" || exit

while true; do
    echo "🔄 Starting auto-commit cycle at $(date)"

    # Stage everything
    git add .

    # Commit if changes exist
    git commit -m "Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')" 2>/dev/null || echo "No changes to commit"

    # Stash any uncommitted changes before pulling
    git stash push -u -m "autocommit-stash" 2>/dev/null || true

    # Pull with rebase to keep history clean
    if git pull --rebase origin main; then
        echo "✅ Pull successful"
    else
        echo "⚠️ Pull failed, continuing anyway..."
    fi

    # Apply stashed changes back (if any)
    git stash pop 2>/dev/null || true

    # Try pushing
    if git push origin main; then
        echo "✅ Push successful at $(date)"
    else
        echo "⚠️ Push failed at $(date). Will retry next cycle."
    fi

    # Sleep 5 minutes
    sleep 300
done
