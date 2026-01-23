#!/bin/bash

# Build the project
echo "Building project..."
cd frontend
bun run build

# Deploy to server (deleting files on remote that don't exist locally)
echo "Deploying to server..."
rsync -avz --delete dist/ pxndey@server:/srv/projects/portfolio-frontend/

echo "Deployment complete!"
