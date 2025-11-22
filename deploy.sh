#!/bin/bash

# This script uses SSH key authentication
# Make sure your SSH key is added to the server's authorized_keys

# Source common deployment functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/deploy-common.sh"

echo "Starting deployment..."

# Kill any processes using port 3000 (needed before starting local dev server)
kill_port_3000

# Install local dependencies
install_local_dependencies
if [ $? -ne 0 ]; then
    exit 1
fi

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

# Wait for the server to be ready
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

# Deploy to server using rsync
deploy_to_server "rsync"

if [ $? -ne 0 ]; then
    exit 1
fi

# Run Cypress tests against deployed production site
echo "Running Cypress tests against deployed production site..."
npx cypress run --config baseUrl="$SITE_URL" --spec "cypress/e2e/404.cy.js,cypress/e2e/basket.cy.js,cypress/e2e/checkout.cy.js,cypress/e2e/contact.cy.js,cypress/e2e/homepage.cy.js,cypress/e2e/itempage.cy.js,cypress/e2e/navigation.cy.js,cypress/e2e/sales.cy.js"
CYPRESS_PROD_EXIT_CODE=$?

if [ $CYPRESS_PROD_EXIT_CODE -ne 0 ]; then
    echo "❌ Cypress tests failed against production site. Aborting deployment."
    exit 1
fi
echo "✅ All Cypress tests passed against production site"
