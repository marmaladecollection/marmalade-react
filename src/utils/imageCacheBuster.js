/**
 * Utility function to prevent image caching by adding timestamp parameters
 * @param {string} src - The image source URL
 * @returns {string} - The image source URL with cache-busting timestamp
 */
export const getCacheBustedSrc = (src) => {
  if (!src) return src;
  
  const timestamp = Date.now();
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}t=${timestamp}`;
};

/**
 * Alternative cache-busting function that uses a random number instead of timestamp
 * This can be useful if you want different cache-busting behavior
 * @param {string} src - The image source URL
 * @returns {string} - The image source URL with cache-busting random number
 */
export const getRandomCacheBustedSrc = (src) => {
  if (!src) return src;
  
  const random = Math.random();
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}r=${random}`;
};

/**
 * Cache-busting function that uses file modification time if available
 * Falls back to timestamp if modification time is not available
 * @param {string} src - The image source URL
 * @param {number} mtime - File modification time (optional)
 * @returns {string} - The image source URL with cache-busting parameter
 */
export const getModTimeCacheBustedSrc = (src, mtime) => {
  if (!src) return src;
  
  const cacheBuster = mtime || Date.now();
  const separator = src.includes('?') ? '&' : '?';
  return `${src}${separator}m=${cacheBuster}`;
};
