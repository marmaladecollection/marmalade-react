describe('404 Page', () => {
  it('should show 404 for unknown route', () => {
    cy.visit('/not-a-page', { failOnStatusCode: false });
    cy.contains(/404|not found|error/i);
  });
}); 