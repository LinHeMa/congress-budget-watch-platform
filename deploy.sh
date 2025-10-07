# run pnpm build
echo "Building project..."
pnpm build
echo "Build complete."

# deploy to gcloud storage
echo "Deploying to gcloud storage..."

# Deploy all files with no cache
echo "Uploading all files with no-store cache control..."
gcloud storage rsync -h "Cache-Control:no-store" ./build/client gs://readr-coverage/project/3/congress-budget-watch

echo "Deployment complete."