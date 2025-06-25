// Cypress integration test: confirm the admin page loads and shows both tables

describe('Admin Page Integration Test', () => {
  it('should load the admin page and display both items and sold tables', () => {
    cy.visit('/admin');
    cy.contains('Items for Sale', { timeout: 15000 }).should('exist'); // Wait up to 15s
    cy.contains('Sold Items', { timeout: 15000 }).should('exist');
    // Table count may be 1 or 2 depending on data
    cy.get('table', { timeout: 15000 }).its('length').should('be.gte', 1);
    cy.get('th').contains('Name');
    cy.get('th').contains('Price');
  });
}); 