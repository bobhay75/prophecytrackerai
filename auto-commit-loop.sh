#!/bin/bash

cd /home/thebobsomest1/trust-ai/projects/prophecytrackerai

echo "🚀 Auto-commit loop started at $(date)" >> /home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit.log

while true; do
  git add .

  COMMIT_MSG="Auto-commit: $(date '+%Y-%m-%d %H:%M:%S')"
  git commit -m "$COMMIT_MSG"

  # Try pushing
  if git push origin main; then
    echo "✅ Pushed successfully at $(date)" >> /home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit.log
  else
    echo "⚠️ Push failed at $(date). Attempting to fix..." >> /home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit.log
    git fetch origin main
    git reset --soft origin/main
    sleep 30
  fi

  sleep 300
done
