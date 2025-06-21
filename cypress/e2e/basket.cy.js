describe('Basket', () => {
  it('should add and remove an item', () => {
    cy.visit('/');
    cy.contains('ADD').first().click();
    // Now on basket page
    cy.contains('Remove').should('exist');
    cy.contains('Remove').click();
    cy.contains('Your bag is currently empty');
  });

  it('should show empty basket message when no items are in the basket', () => {
    cy.visit('/');
    cy.contains(/basket|bag/i).click();
    cy.contains('Your bag is currently empty').should('exist');
  });
}); 