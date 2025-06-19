#!/bin/bash

# Set your SSH password as an environment variable for security
# You can set this by running: export SSHPASS="your_password_here"
# Or create a .env file (make sure it's in .gitignore)

if [ -z "$SSHPASS" ]; then
    echo "Error: SSHPASS environment variable is not set."
    echo "Please set it by running: export SSHPASS=\"your_password_here\""
    exit 1
fi

echo "Starting deployment..."

# Install dependencies
echo "Installing dependencies..."
npm install
INSTALL_EXIT_CODE=$?

if [ $INSTALL_EXIT_CODE -ne 0 ]; then
    echo "✗ Dependencies installation failed. Aborting deployment."
    exit 1
fi
echo "✓ Dependencies installed successfully"

# Sync files using rsync with sshpass
echo "Syncing files to server..."
sshpass -e rsync -avz --progress --ignore-times --exclude '.git' --exclude '.next' --exclude 'node_modules' . root@217.154.9.107:/srv/marmalade/
RSYNC_EXIT_CODE=$?

if [ $RSYNC_EXIT_CODE -eq 0 ]; then
    echo "File sync completed successfully."
    
    # Build and restart application
    echo "Building application..."
    sshpass -e ssh root@217.154.9.107 "cd /srv/marmalade && npm run build"
    BUILD_EXIT_CODE=$?
    
    if [ $BUILD_EXIT_CODE -eq 0 ]; then
        echo "✓ Build completed successfully"
        echo "Restarting application with PM2..."
        sshpass -e ssh root@217.154.9.107 "pm2 restart marmalade"
        if [ $? -eq 0 ]; then
            echo "✓ Application restarted successfully"
        else
            echo "⚠ Warning: PM2 restart may have failed"
        fi
    else
        echo "✗ Build failed. Skipping PM2 restart."
        exit 1
    fi
    
    # Verify site is accessible
    echo "Verifying site is accessible..."
    sleep 3  # Give PM2 a moment to fully restart
    
    if curl -s --max-time 10 -o /dev/null -w "%{http_code}" https://www.marmaladecollection.com | grep -q "200"; then
        echo "✓ Site is accessible at https://www.marmaladecollection.com"
    else
        echo "⚠ Warning: Site may not be responding correctly at https://www.marmaladecollection.com"
        echo "Checking HTTP status:"
        curl -s --max-time 10 -w "HTTP Status: %{http_code}\n" https://www.marmaladecollection.com -o /dev/null
    fi
    
    # Connect to server via SSH and change to /srv/marmalade directory
    echo "Connecting to server and changing to /srv/marmalade directory..."
    sshpass -e ssh -t root@217.154.9.107 "cd /srv/marmalade && exec bash"
else
    echo "File sync failed. Aborting deployment."
    exit 1
fi
