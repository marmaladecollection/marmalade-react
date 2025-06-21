// Cypress smoke test: confirm the home page loads

describe('Homepage Smoke Test', () => {
  it('should load the home page', () => {
    cy.visit('/');
    cy.contains(/marmalade/i).should('exist'); // Case-insensitive match
  });
});
