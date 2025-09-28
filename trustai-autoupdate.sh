#!/bin/bash
cd "$(dirname "$0")"
git pull origin main
npm install
npm run build
npm restart || npm start
