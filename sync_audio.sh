#!/bin/bash

echo "--- Performing a dry run to see what files will be synced ---"
rsync -avzin --out-format="%n" /Users/pxndey/dev/portfolio/audio/ server:/srv/projects/portfolio-backend/audio

echo ""
echo "--- Starting the actual sync ---"
rsync -avz /Users/pxndey/dev/portfolio/audio/ server:/srv/projects/portfolio-backend/audio
