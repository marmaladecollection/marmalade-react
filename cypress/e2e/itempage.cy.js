describe('Item Page', () => {
  it('should display item details and actions', () => {
    cy.visit('/');
    cy.get('a[href*="/item/"]').first().click();
    cy.get('span').should('exist');
    cy.contains('Add to bag').should('exist');
  });

  it('should display images and cycle through them', () => {
    // Visit card-table specifically as we know it has multiple images
    cy.visit('/item/card-table');

    // 1. Verify main image is visible
    // We expect at least one image to be visible
    cy.get('img[alt="George III Mahogany Card Table"]').filter(':visible').should('have.length', 1);
    
    // 2. Verify Next button exists
    cy.get('button[aria-label="Next image"]').should('exist');

    // 3. Click Next and verify image changes
    // Get the initial visible image src
    cy.get('img[alt="George III Mahogany Card Table"]:visible')
      .invoke('attr', 'src')
      .then((firstSrc) => {
        // Click next
        cy.get('button[aria-label="Next image"]').click();

        // Verify a NEW image is now visible
        cy.get('img[alt="George III Mahogany Card Table"]:visible')
          .should('have.attr', 'src')
          .and('not.equal', firstSrc);
          
        // Verify the new image contains the correct variant in URL (e.g., card-table-1)
        cy.get('img[alt="George III Mahogany Card Table"]:visible')
          .invoke('attr', 'src')
          .should('include', 'card-table-1');
      });
  });
});
