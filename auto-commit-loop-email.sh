#!/bin/bash
# auto-commit-loop-email.sh
# Auto-commit every 5 minutes with retry logic + email notifications

MAX_HOURS=12
SLEEP_INTERVAL=300  # 5 minutes
MAX_RETRIES=3
START_TIME=$(date +%s)
LOG_FILE="/home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit-email.log"
ALERT_EMAIL="thebobsomest1@gmail.com"

while true; do
    CURRENT_TIME=$(date +%s)
    ELAPSED_HOURS=$(( (CURRENT_TIME - START_TIME) / 3600 ))
    if [ "$ELAPSED_HOURS" -ge "$MAX_HOURS" ]; then
        echo "$(date): Max runtime reached ($MAX_HOURS hours). Stopping auto-commit loop." >> "$LOG_FILE"
        break
    fi

    RETRY=0
    SUCCESS=0
    while [ $RETRY -lt $MAX_RETRIES ]; do
        if /home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit.sh >> "$LOG_FILE" 2>&1; then
            echo "$(date): Auto-commit successful on try $((RETRY+1))." >> "$LOG_FILE"
            SUCCESS=1
            break
        else
            echo "$(date): Auto-commit failed on try $((RETRY+1)). Retrying..." >> "$LOG_FILE"
            RETRY=$((RETRY+1))
            sleep 10
        fi
    done

    if [ $SUCCESS -eq 0 ]; then
        echo "$(date): All retries failed! Sending email alert." >> "$LOG_FILE"
        echo "Auto-commit failed at $(date) after $MAX_RETRIES attempts. Check log: $LOG_FILE" \
        | mail -s "ProphecyTrackerAI Commit Failed" "$ALERT_EMAIL"
    fi

    sleep $SLEEP_INTERVAL
done
