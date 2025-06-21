describe('Item Page', () => {
  it('should display item details and actions', () => {
    cy.visit('/');
    cy.get('a[href*="/item/"]').first().click();
    cy.get('span').should('exist');
    cy.contains('Add to bag').should('exist');
  });
}); 