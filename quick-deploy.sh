#!/bin/bash

# Quick deployment script - skips tests for faster deployment
# Only use this when you're confident tests pass!
# This script uses SSH key authentication
# Make sure your SSH key is added to the server's authorized_keys

# Source common deployment functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/deploy-common.sh"

echo "🚀 Starting QUICK deployment (skipping tests)..."
echo "⚠️  WARNING: This skips all test validation!"

# Install local dependencies
install_local_dependencies
if [ $? -ne 0 ]; then
    exit 1
fi

# Deploy to server using rsync
deploy_to_server "rsync"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 QUICK DEPLOYMENT COMPLETE!"
    echo "⚠️  Remember: This deployment skipped all tests."
    echo "💡 Run ./deploy.sh for a full deployment with tests."
else
    exit 1
fi
