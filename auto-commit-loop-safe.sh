#!/bin/bash
# auto-commit-loop-safe.sh
# Run auto-commit.sh every 5 minutes, stop after 12 hours, notify on failure

MAX_HOURS=12
SLEEP_INTERVAL=300  # 5 minutes
START_TIME=$(date +%s)
LOG_FILE="/home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit-safe.log"

while true; do
    # Check elapsed time
    CURRENT_TIME=$(date +%s)
    ELAPSED_HOURS=$(( (CURRENT_TIME - START_TIME) / 3600 ))
    if [ "$ELAPSED_HOURS" -ge "$MAX_HOURS" ]; then
        echo "$(date): Max runtime reached ($MAX_HOURS hours). Stopping auto-commit loop." >> "$LOG_FILE"
        break
    fi

    # Run auto-commit script
    if ! /home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit.sh >> "$LOG_FILE" 2>&1; then
        echo "$(date): Auto-commit script failed!" >> "$LOG_FILE"
        # Optional: send email or desktop notification here
    else
        echo "$(date): Auto-commit successful." >> "$LOG_FILE"
    fi

    sleep $SLEEP_INTERVAL
done
