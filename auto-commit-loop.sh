#!/bin/bash
# auto-commit-loop.sh
# Continuously run auto-commit.sh every 5 minutes

while true; do
    /home/thebobsomest1/trust-ai/projects/prophecytrackerai/auto-commit.sh
    sleep 300  # wait 5 minutes
done
