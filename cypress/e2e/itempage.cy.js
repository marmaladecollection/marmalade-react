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

  it('should cycle through all desk-manor images correctly without duplicates', () => {
    // Visit desk-manor item page - we know it has exactly 5 images:
    // desk-manor.jpg (main), desk-manor-1.jpg, desk-manor-2.jpg, desk-manor-3.jpg, desk-manor-4.jpg
    cy.visit('/item/desk-manor');

    // Wait for page to load and item to be fetched
    cy.contains('Add to bag', { timeout: 10000 }).should('exist');

    // Wait for image discovery to complete (loading indicator should disappear)
    // The loading indicator appears when discovering images
    cy.get('button[aria-label="Next image"]', { timeout: 10000 }).should('exist');
    
    // Small delay to ensure image discovery has completed
    cy.wait(1000);

    // Get the initial image (should be desk-manor.jpg - the main image)
    cy.get('img:visible').first().invoke('attr', 'src').then((initialSrc) => {
      expect(initialSrc).to.include('desk-manor');
      // Main image should be desk-manor.jpg (not a numbered variant)
      expect(initialSrc).to.not.include('desk-manor-');

      // Track all images we see during the cycle
      const seenImages = [initialSrc];

      // Click through all 5 images (4 more clicks after the initial one)
      // After 5 clicks total, we should be back to the main image
      
      // Click 1: should show desk-manor-1.jpg
      cy.get('button[aria-label="Next image"]').click();
      cy.wait(200);
      cy.get('img:visible').first().invoke('attr', 'src').then((src1) => {
        seenImages.push(src1);
        expect(src1).to.include('desk-manor-1');

        // Click 2: should show desk-manor-2.jpg
        cy.get('button[aria-label="Next image"]').click();
        cy.wait(200);
        cy.get('img:visible').first().invoke('attr', 'src').then((src2) => {
          seenImages.push(src2);
          expect(src2).to.include('desk-manor-2');

          // Click 3: should show desk-manor-3.jpg
          cy.get('button[aria-label="Next image"]').click();
          cy.wait(200);
          cy.get('img:visible').first().invoke('attr', 'src').then((src3) => {
            seenImages.push(src3);
            expect(src3).to.include('desk-manor-3');

            // Click 4: should show desk-manor-4.jpg
            cy.get('button[aria-label="Next image"]').click();
            cy.wait(200);
            cy.get('img:visible').first().invoke('attr', 'src').then((src4) => {
              seenImages.push(src4);
              expect(src4).to.include('desk-manor-4');

              // Click 5: should be back to main image (desk-manor.jpg)
              cy.get('button[aria-label="Next image"]').click();
              cy.wait(200);
              cy.get('img:visible').first().invoke('attr', 'src').then((src5) => {
                seenImages.push(src5);
                
                // After 5 clicks, should return to main image
                expect(src5).to.equal(initialSrc, 'After 5 clicks, should return to main image');
                
                // Verify we saw exactly 5 unique images (no duplicates)
                const uniqueImages = [...new Set(seenImages)];
                expect(uniqueImages.length).to.equal(5, 'Should have exactly 5 unique images in the cycle (no duplicates)');
                
                // Verify all images are desk-manor variants
                seenImages.forEach((imgSrc, idx) => {
                  expect(imgSrc).to.include('desk-manor', `Image ${idx + 1} should be a desk-manor image`);
                });
                
                // Verify the expected images are present:
                // - Main image: desk-manor.jpg
                // - Variants: desk-manor-1.jpg, desk-manor-2.jpg, desk-manor-3.jpg, desk-manor-4.jpg
                const hasMain = seenImages.some(src => src.includes('desk-manor.jpg') && !src.includes('desk-manor-'));
                const hasVariant1 = seenImages.some(src => src.includes('desk-manor-1.jpg'));
                const hasVariant2 = seenImages.some(src => src.includes('desk-manor-2.jpg'));
                const hasVariant3 = seenImages.some(src => src.includes('desk-manor-3.jpg'));
                const hasVariant4 = seenImages.some(src => src.includes('desk-manor-4.jpg'));
                
                expect(hasMain).to.be.true;
                expect(hasVariant1).to.be.true;
                expect(hasVariant2).to.be.true;
                expect(hasVariant3).to.be.true;
                expect(hasVariant4).to.be.true;
              });
            });
          });
        });
      });
    });
  });
});
