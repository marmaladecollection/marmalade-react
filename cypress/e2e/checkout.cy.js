describe('Checkout', () => {
  it('should show error for undeliverable postcode', () => {
    cy.visit('/');
    cy.contains('ADD').first().click();
    cy.contains(/Go To Checkout|checkout|to checkout/i).click();
    cy.get('input#line1').type('123 Test St');
    cy.get('input#city').type('London');
    cy.get('input#postcode').type('N5 2QT');
    cy.contains('Continue to Payment').click();
    cy.get('#address-error').should('exist');
  });
}); 