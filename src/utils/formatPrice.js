/**
 * Formats a price with thousand separators and currency symbol
 * @param {number|string} price - The price to format
 * @param {string} currency - The currency symbol (default: '£')
 * @returns {string} Formatted price string (e.g., '£2,000')
 */
export function formatPrice(price, currency = '£') {
  const numPrice = Number(price);
  
  if (isNaN(numPrice)) {
    return `${currency}0`;
  }
  
  // Use toLocaleString with en-GB locale for comma separators
  return `${currency}${numPrice.toLocaleString('en-GB')}`;
}

