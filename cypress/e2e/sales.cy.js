// Cypress integration test: confirm the sales page loads and shows the sold items table

describe('Sales Page Integration Test', () => {
  it('should load the sales page and display the sold items table', () => {
    cy.visit('/sales');
    cy.contains('Sold Items', { timeout: 15000 }).should('exist'); // Wait up to 15s
    cy.get('table', { timeout: 15000 }).should('have.length', 1); // There should be one table
    cy.get('th').contains('Name');
    cy.get('th').contains('Price');
  });
}); 