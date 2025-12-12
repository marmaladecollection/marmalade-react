describe('Navigation', () => {
  const pages = [
    { linkText: /about/i, url: '/about', content: 'About' },
    { linkText: /contact/i, url: '/contact', content: "We'd love to hear from you!" },
    { linkText: /delivery/i, url: '/delivery', content: 'Delivery Options' },
    { linkText: /returns/i, url: '/returns', content: 'Returns are accepted within 20 days of delivery.' },
    { linkText: '[data-testid="bag-count"]', url: '/basket', content: 'Your bag is currently empty' },
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
      cy.contains(content);
    });
  });
}); 