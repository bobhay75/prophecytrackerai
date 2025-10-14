#!/bin/bash
# Start the FastAPI backend

cd ~/trust-ai/projects/prophecytrackerai/backend

# Activate virtual environment
source venv/bin/activate

# Run FastAPI app with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
