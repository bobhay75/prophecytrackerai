#!/bin/bash
cd ~/trust-ai/projects/prophecytrackerai || exit
git add .
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
COMMIT_MSG="Auto-commit: $TIMESTAMP"
git commit -m "$COMMIT_MSG"
git push origin main
echo "✅ All changes committed and pushed successfully at $TIMESTAMP."
