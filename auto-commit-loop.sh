#!/bin/bash

cd /home/thebobsomest1/trust-ai/projects/prophecytrackerai

# Generate unique ID for this loop
LOOP_ID=$(date +%s%N | tail -c 5)

echo "🚀 Auto-commit loop [$LOOP_ID] started at $(date)" >> /home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit.log

while true; do
  git add .

  COMMIT_MSG="Auto-commit [$LOOP_ID]: $(date '+%Y-%m-%d %H:%M:%S')"
  git commit -m "$COMMIT_MSG"

  # Try pushing
  if git push origin main; then
    echo "✅ Loop [$LOOP_ID] pushed successfully at $(date)" >> /home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit.log
  else
    echo "⚠️ Loop [$LOOP_ID] push failed at $(date). Attempting to fix..." >> /home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit.log
    git fetch origin main
    git reset --soft origin/main
    sleep 30
  fi

  sleep 300
done
