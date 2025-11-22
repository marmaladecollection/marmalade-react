#!/bin/bash

# Quick deployment script - skips tests for faster deployment
# Only use this when you're confident tests pass!

if [ -z "$SSHPASS" ]; then
    echo "Error: SSHPASS environment variable is not set."
    echo "Please set it by running: export SSHPASS=\"your_password_here\""
    exit 1
fi

# Source common deployment functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Override SSH command to use sshpass before sourcing
SSH_CMD="sshpass -e ssh -o ServerAliveInterval=60 -o ServerAliveCountMax=10"
source "$SCRIPT_DIR/deploy-common.sh"

# Override run_ssh function to use sshpass
run_ssh() {
    sshpass -e ssh -o ServerAliveInterval=60 -o ServerAliveCountMax=10 "$SERVER" "$@"
}

echo "🚀 Starting QUICK deployment (skipping tests)..."
echo "⚠️  WARNING: This skips all test validation!"

# Deploy to server using rsync with sshpass
deploy_to_server "sshpass -e rsync"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 QUICK DEPLOYMENT COMPLETE!"
    echo "⚠️  Remember: This deployment skipped all tests."
    echo "💡 Run ./deploy.sh for a full deployment with tests."
else
    exit 1
fi
