// Cypress integration test: confirm the admin page loads and shows the item count

describe('Admin Page Integration Test', () => {
  it('should load the admin page and display the item count', () => {
    cy.visit('/admin');
    cy.contains(/admin/i).should('exist'); // Case-insensitive match for title
    cy.contains(/number of items for sale:/i).should('exist'); // Check for item count label
  });
}); 