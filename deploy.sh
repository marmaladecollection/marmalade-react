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
    echo "❌ Dependencies installation failed. Aborting deployment."
    exit 1
fi
echo "✅ Dependencies installed successfully"

# Run unit tests
echo "Running unit tests..."
npx jest --watchAll=false --passWithNoTests --ci
TEST_EXIT_CODE=$?

if [ $TEST_EXIT_CODE -ne 0 ]; then
    echo "❌ Unit tests failed. Aborting deployment."
    echo "Please fix failing tests before deploying."
    exit 1
fi
echo "✅ All unit tests passed"

# Start local dev server in background for Cypress tests
echo "Starting local dev server for Cypress tests..."
npm run dev &
DEV_SERVER_PID=$!

# Wait for the server to be ready (adjust the URL and timeout as needed)
echo "Waiting for local dev server to be ready..."
MAX_TRIES=20
TRIES=0
until curl -s http://localhost:3000 > /dev/null; do
  sleep 1
  TRIES=$((TRIES+1))
  if [ $TRIES -ge $MAX_TRIES ]; then
    echo "❌ Local dev server did not start in time. Aborting deployment."
    kill $DEV_SERVER_PID
    exit 1
  fi
done
echo "✅ Local dev server is up. Running Cypress tests..."

# Run Cypress tests
npx cypress run --config baseUrl=http://localhost:3000
CYPRESS_EXIT_CODE=$?

# Stop the dev server
kill $DEV_SERVER_PID
wait $DEV_SERVER_PID 2>/dev/null

if [ $CYPRESS_EXIT_CODE -ne 0 ]; then
    echo "❌ Cypress tests failed. Aborting deployment."
    exit 1
fi
echo "✅ All Cypress tests passed"

# Sync files using rsync with sshpass
echo "Syncing files to server..."
sshpass -e rsync -avz --progress --ignore-times --exclude '.git' --exclude '.next' --exclude 'node_modules' . root@217.154.9.107:/srv/marmalade/
RSYNC_EXIT_CODE=$?

if [ $RSYNC_EXIT_CODE -eq 0 ]; then
    echo "File sync completed successfully."
    
    # Install dependencies and build application
    echo "Installing dependencies on server..."
    sshpass -e ssh root@217.154.9.107 "cd /srv/marmalade && npm cache clean --force && rm -f package-lock.json && rm -rf node_modules/@next/swc-darwin-arm64 node_modules/@next/swc-darwin-x64 && npm install --force --no-audit"
    INSTALL_SERVER_EXIT_CODE=$?
    
    if [ $INSTALL_SERVER_EXIT_CODE -eq 0 ]; then
        echo "✅ Server dependencies installed successfully"
        echo "Building application..."
        sshpass -e ssh root@217.154.9.107 "cd /srv/marmalade && npm run build"
    else
        echo "❌ Server dependency installation failed. Skipping build."
        exit 1
    fi
    BUILD_EXIT_CODE=$?
    
    if [ $BUILD_EXIT_CODE -eq 0 ]; then
        echo "✅ Build completed successfully"
        echo "Restarting application with PM2..."
        sshpass -e ssh root@217.154.9.107 "pm2 restart marmalade"
        if [ $? -eq 0 ]; then
            echo "✅ Application restarted successfully"
        else
            echo "⚠️ Warning: PM2 restart may have failed"
        fi
    else
        echo "❌ Build failed. Skipping PM2 restart."
        exit 1
    fi
    
    # Verify site is accessible
    echo "Verifying site is accessible..."
    sleep 3  # Give PM2 a moment to fully restart
    
    if curl -s --max-time 10 -o /dev/null -w "%{http_code}" https://www.marmaladecollection.com | grep -q "200"; then
        echo "✅ Site is accessible at https://www.marmaladecollection.com"
        
        # Run Cypress tests against deployed production site
        echo "Running Cypress tests against deployed production site..."
        npx cypress run --config baseUrl=https://www.marmaladecollection.com --spec "cypress/e2e/404.cy.js,cypress/e2e/basket.cy.js,cypress/e2e/checkout.cy.js,cypress/e2e/contact.cy.js,cypress/e2e/homepage.cy.js,cypress/e2e/itempage.cy.js,cypress/e2e/navigation.cy.js,cypress/e2e/sales.cy.js"
        CYPRESS_PROD_EXIT_CODE=$?
        if [ $CYPRESS_PROD_EXIT_CODE -ne 0 ]; then
            echo "❌ Cypress tests failed against production site. Aborting deployment."
            exit 1
        fi
        echo "✅ All Cypress tests passed against production site"
    else
        echo "⚠️ Warning: Site may not be responding correctly at https://www.marmaladecollection.com"
        echo "Checking HTTP status:"
        curl -s --max-time 10 -w "HTTP Status: %{http_code}\n" https://www.marmaladecollection.com -o /dev/null
    fi
else
    echo "File sync failed. Aborting deployment."
    exit 1
fi
