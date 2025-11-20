#!/bin/bash

# Quick deployment script - skips tests for faster deployment
# Only use this when you're confident tests pass!

if [ -z "$SSHPASS" ]; then
    echo "Error: SSHPASS environment variable is not set."
    echo "Please set it by running: export SSHPASS=\"your_password_here\""
    exit 1
fi

echo "🚀 Starting QUICK deployment (skipping tests)..."
echo "⚠️  WARNING: This skips all test validation!"

# Delete existing images on server before syncing
echo "🗑️  Deleting existing images on server..."
sshpass -e ssh root@217.154.9.107 "rm -rf /srv/marmalade/public/images/*"
echo "✅ Existing images deleted"

# Sync files using rsync with sshpass
echo "📦 Syncing files to server..."
sshpass -e rsync -avz --progress --ignore-times --exclude '.git' --exclude '.next' --exclude 'node_modules' . root@217.154.9.107:/srv/marmalade/
RSYNC_EXIT_CODE=$?

if [ $RSYNC_EXIT_CODE -eq 0 ]; then
    echo "✅ File sync completed successfully."
    
    # Install dependencies and build application
    echo "📥 Installing dependencies on server..."
    sshpass -e ssh root@217.154.9.107 "cd /srv/marmalade && npm cache clean --force && rm -f package-lock.json && rm -rf node_modules/@next/swc-darwin-arm64 node_modules/@next/swc-darwin-x64 && npm install --force --no-audit"
    INSTALL_SERVER_EXIT_CODE=$?
    
    if [ $INSTALL_SERVER_EXIT_CODE -eq 0 ]; then
        echo "✅ Server dependencies installed successfully"
        echo "⚙️  Setting up production environment..."
        sshpass -e ssh root@217.154.9.107 "cd /srv/marmalade && cp .env.production .env.local"
        echo "🔨 Building application with production environment..."
        sshpass -e ssh root@217.154.9.107 "cd /srv/marmalade && NODE_ENV=production npm run build"
    else
        echo "❌ Server dependency installation failed. Skipping build."
        exit 1
    fi
    BUILD_EXIT_CODE=$?
    
    if [ $BUILD_EXIT_CODE -eq 0 ]; then
        echo "✅ Build completed successfully"
        echo "♻️  Restarting application with PM2 in production mode..."
        sshpass -e ssh root@217.154.9.107 "cd /srv/marmalade && NODE_ENV=production pm2 restart marmalade --update-env"
        if [ $? -eq 0 ]; then
            echo "✅ Application restarted successfully"
        else
            echo "⚠️  Warning: PM2 restart may have failed"
        fi
    else
        echo "❌ Build failed. Skipping PM2 restart."
        exit 1
    fi
    
    # Verify site is accessible
    echo "🔍 Verifying site is accessible..."
    sleep 3  # Give PM2 a moment to fully restart
    
    if curl -s --max-time 10 -o /dev/null -w "%{http_code}" https://www.marmaladecollection.com | grep -q "200"; then
        echo "✅ Site is accessible at https://www.marmaladecollection.com"
        echo ""
        echo "🎉 QUICK DEPLOYMENT COMPLETE!"
        echo "⚠️  Remember: This deployment skipped all tests."
        echo "💡 Run ./deploy.sh for a full deployment with tests."
    else
        echo "⚠️  Warning: Site may not be responding correctly at https://www.marmaladecollection.com"
        echo "Checking HTTP status:"
        curl -s --max-time 10 -w "HTTP Status: %{http_code}\n" https://www.marmaladecollection.com -o /dev/null
    fi
else
    echo "❌ File sync failed. Aborting deployment."
    exit 1
fi

