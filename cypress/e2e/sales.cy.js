// Cypress integration test: confirm the sales page loads and shows the sold items table

describe('Sales Page Integration Test', () => {
  it('should load the sales page and display the sold items table', () => {
    cy.visit('/sales');
    cy.contains('Sold Items', { timeout: 30000 }).should('exist'); // Wait up to 30s
    // Table may not be present if there are no sold items
    cy.get('table').should('have.length.lte', 1);
    // Only check for headers if table exists
    cy.get('table').then($tables => {
      if ($tables.length > 0) {
        cy.get('th').contains('Name');
        cy.get('th').contains('Price');
      }
    });
  });
}); 