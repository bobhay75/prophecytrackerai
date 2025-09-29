#!/bin/bash
# auto-commit-loop-email.sh
# Auto-commit every 5 minutes with email notifications on failure
# Requires 'mail' command configured on your system

MAX_HOURS=12
SLEEP_INTERVAL=300  # 5 minutes
START_TIME=$(date +%s)
LOG_FILE="/home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit-email.log"
ALERT_EMAIL="thebobsomest1@gmail.com"  # Change to your notification email

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
        echo "Auto-commit failed at $(date). Check log: $LOG_FILE" | mail -s "ProphecyTrackerAI Commit Failed" "$ALERT_EMAIL"
    else
        echo "$(date): Auto-commit successful." >> "$LOG_FILE"
    fi

    sleep $SLEEP_INTERVAL
done
