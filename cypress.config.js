const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js',
    baseUrl: 'http://localhost:3000', // Default to local dev server
    defaultCommandTimeout: 10000, // Increased from default 4000ms for slow network/Firebase
  },
}); 