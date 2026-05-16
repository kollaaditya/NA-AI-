#!/bin/bash
# NA AI Systems - AWS S3 + CloudFront Frontend Deployment
# Prerequisites: AWS CLI configured with appropriate IAM permissions

set -e

S3_BUCKET="na-ai-systems-frontend"
CLOUDFRONT_DIST_ID="YOUR_CLOUDFRONT_DISTRIBUTION_ID"
REGION="us-east-1"

echo "=========================================="
echo "  Deploying Frontend to AWS S3 + CloudFront"
echo "=========================================="

# 1. Build the React app
echo "[1/4] Building React application..."
cd client
npm run build

# 2. Sync to S3
echo "[2/4] Uploading to S3 bucket: $S3_BUCKET..."
aws s3 sync dist/ s3://$S3_BUCKET \
  --region $REGION \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "index.html"

# Upload index.html with no-cache
aws s3 cp dist/index.html s3://$S3_BUCKET/index.html \
  --region $REGION \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html"

# 3. Invalidate CloudFront cache
echo "[3/4] Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $CLOUDFRONT_DIST_ID \
  --paths "/*"

echo "[4/4] Done!"
echo ""
echo "=========================================="
echo "  Frontend deployed successfully!"
echo "  S3: s3://$S3_BUCKET"
echo "  CloudFront: https://your-domain.cloudfront.net"
echo "=========================================="
