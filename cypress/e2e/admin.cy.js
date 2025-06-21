// Cypress integration test: confirm the admin page loads and shows the item table

describe('Admin Page Integration Test', () => {
  it('should load the admin page and display the items table', () => {
    cy.visit('/admin');
    cy.contains(/admin/i).should('exist'); // Case-insensitive match for title
    cy.contains('Items for Sale').should('exist'); // Check for table heading
    cy.get('table').should('exist'); // Table should be present
    cy.get('th').contains('Name');
    cy.get('th').contains('Price');
  });
}); 