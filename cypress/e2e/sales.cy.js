// Cypress integration test: confirm the sales page loads and shows the sold items table

describe('Sales Page Integration Test', () => {
  it('should load the sales page and display the sold items table', () => {
    cy.visit('/sales');
    cy.contains('Sold Items', { timeout: 30000 }).should('exist'); // Wait up to 30s
    // Pass if either the table is present or the 'No sales yet' message is present
    cy.get('body').then($body => {
      if ($body.find('table').length > 0) {
        cy.get('th').contains('Name');
        cy.get('th').contains('Price');
      } else {
        cy.contains('No sales yet').should('exist');
      }
    });
  });
}); 