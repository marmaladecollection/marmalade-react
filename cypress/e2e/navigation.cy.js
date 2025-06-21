describe('Navigation', () => {
  const pages = [
    { linkText: /about/i, url: '/about', content: /about/i },
    { linkText: /contact/i, url: '/contact', content: 'team@marmaladecollection.com' },
    { linkText: /delivery/i, url: '/delivery', content: /delivery/i },
    { linkText: /returns/i, url: '/returns', content: /returns/i },
    { linkText: '[data-testid="bag-count"]', url: '/basket', content: null },
  ];
  pages.forEach(({ linkText, url, content }) => {
    it(`should navigate to ${url} page`, () => {
      cy.visit('/');
      if (url === '/basket') {
        cy.get('[data-testid="bag-count"]').click();
      } else {
        cy.contains(linkText).click();
      }
      cy.url().should('include', url);
      if (content) {
        cy.contains(content);
      } else if (url === '/basket') {
        cy.get('body').then($body => {
          if ($body.text().includes('Your bag is currently empty')) {
            cy.contains('Your bag is currently empty').should('exist');
          } else {
            cy.contains('Remove').should('exist');
          }
        });
      }
    });
  });
}); 