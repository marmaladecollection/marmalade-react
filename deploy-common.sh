#!/bin/bash

# Common deployment functions shared between deploy.sh and quick-deploy.sh

# Server configuration
SERVER="root@217.154.9.107"
SERVER_PATH="/srv/marmalade"
SITE_URL="https://www.marmaladecollection.com"

# SSH command wrapper - can be overridden by scripts
SSH_CMD="ssh -o ServerAliveInterval=60 -o ServerAliveCountMax=10"

# Function to run SSH command (can be overridden to use sshpass)
run_ssh() {
    $SSH_CMD "$SERVER" "$@"
}

# Function to sync files to server
sync_files() {
    local RSYNC_CMD="$1"
    echo "Syncing files to server..."
    $RSYNC_CMD -avz --progress --ignore-times --delete \
        --exclude '.git' \
        --exclude '.next' \
        --exclude 'node_modules' \
        --exclude 'ssl' \
        . "$SERVER:$SERVER_PATH/"
    return $?
}

# Function to clean npm cache and remove Darwin-specific modules
clean_server_dependencies() {
    echo "Cleaning npm cache on server..."
    run_ssh "cd $SERVER_PATH && npm cache clean --force"
    
    echo "Removing old lock files and Darwin-specific modules..."
    run_ssh "cd $SERVER_PATH && rm -f package-lock.json && rm -rf node_modules/@next/swc-darwin-arm64 node_modules/@next/swc-darwin-x64"
}

# Function to install dependencies on server
install_server_dependencies() {
    echo "Installing dependencies on server (this may take a few minutes)..."
    run_ssh "cd $SERVER_PATH && npm install --force --no-audit"
    return $?
}

# Function to set up production environment
setup_production_env() {
    echo "Setting up production environment..."
    run_ssh "cd $SERVER_PATH && cp .env.production .env.local"
}

# Function to build application
build_application() {
    echo "Building application with production environment..."
    run_ssh "cd $SERVER_PATH && NODE_ENV=production npm run build"
    return $?
}

# Function to restart PM2 application
restart_pm2() {
    echo "Restarting application with PM2 in production mode..."
    run_ssh "cd $SERVER_PATH && NODE_ENV=production pm2 restart marmalade --update-env"
    if [ $? -eq 0 ]; then
        echo "✅ Application restarted successfully"
        return 0
    else
        echo "⚠️  Warning: PM2 restart may have failed"
        return 1
    fi
}

# Function to verify site is accessible
verify_site_accessible() {
    echo "Verifying site is accessible..."
    sleep 3  # Give PM2 a moment to fully restart
    
    if curl -s --max-time 10 -o /dev/null -w "%{http_code}" "$SITE_URL" | grep -q "200"; then
        echo "✅ Site is accessible at $SITE_URL"
        return 0
    else
        echo "⚠️  Warning: Site may not be responding correctly at $SITE_URL"
        echo "Checking HTTP status:"
        curl -s --max-time 10 -w "HTTP Status: %{http_code}\n" "$SITE_URL" -o /dev/null
        return 1
    fi
}

# Function to deploy to server (main deployment logic)
deploy_to_server() {
    local RSYNC_CMD="$1"
    
    # Sync files
    sync_files "$RSYNC_CMD"
    RSYNC_EXIT_CODE=$?
    
    if [ $RSYNC_EXIT_CODE -ne 0 ]; then
        echo "❌ File sync failed. Aborting deployment."
        return 1
    fi
    
    echo "✅ File sync completed successfully."
    
    # Clean and install dependencies
    clean_server_dependencies
    
    install_server_dependencies
    INSTALL_SERVER_EXIT_CODE=$?
    
    if [ $INSTALL_SERVER_EXIT_CODE -ne 0 ]; then
        echo "❌ Server dependency installation failed. Skipping build."
        return 1
    fi
    
    echo "✅ Server dependencies installed successfully"
    
    # Set up production environment
    setup_production_env
    
    # Build application
    build_application
    BUILD_EXIT_CODE=$?
    
    if [ $BUILD_EXIT_CODE -ne 0 ]; then
        echo "❌ Build failed. Skipping PM2 restart."
        return 1
    fi
    
    echo "✅ Build completed successfully"
    
    # Restart PM2
    restart_pm2
    
    # Verify site is accessible
    verify_site_accessible
    
    return 0
}

