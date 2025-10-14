#!/bin/bash
# First-time setup for backend

# Navigate to backend folder
cd ~/trust-ai/projects/prophecytrackerai/backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install required packages
pip install fastapi uvicorn sqlalchemy

echo "Backend setup complete!"
