// Integration test: verify all items in Firestore have dimensions specified
// This test queries Firestore directly using a Cypress task

describe('Item Dimensions Validation', () => {
  it('should have dimensions specified for all items', () => {
    // Use Cypress task to fetch items from Firestore
    cy.task('fetchAllItems').then((items) => {
      expect(items.length).to.be.greaterThan(0, 'Should have at least one item');

      // Check each item has dimensions
      const itemsWithoutDimensions = [];
      items.forEach((item) => {
        if (!item.dimensions || item.dimensions.trim() === '') {
          itemsWithoutDimensions.push({
            id: item.id,
            name: item.name || 'Unknown'
          });
        }
      });

      // Assert all items have dimensions
      if (itemsWithoutDimensions.length > 0) {
        const missingDimensionsList = itemsWithoutDimensions
          .map(item => `  - ${item.name} (${item.id})`)
          .join('\n');
        throw new Error(
          `Found ${itemsWithoutDimensions.length} item(s) without dimensions:\n${missingDimensionsList}`
        );
      }

      // Also verify dimensions format (should contain "x" as separator)
      const itemsWithInvalidFormat = [];
      items.forEach((item) => {
        if (item.dimensions && !item.dimensions.includes('x')) {
          itemsWithInvalidFormat.push({
            id: item.id,
            name: item.name || 'Unknown',
            dimensions: item.dimensions
          });
        }
      });

      if (itemsWithInvalidFormat.length > 0) {
        const invalidFormatList = itemsWithInvalidFormat
          .map(item => `  - ${item.name} (${item.id}): "${item.dimensions}"`)
          .join('\n');
        throw new Error(
          `Found ${itemsWithInvalidFormat.length} item(s) with invalid dimensions format (should contain "x"):\n${invalidFormatList}`
        );
      }
    });
  });
});

