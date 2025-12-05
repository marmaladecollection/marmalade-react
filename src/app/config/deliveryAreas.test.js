import { isValidDeliveryPostcode } from './deliveryAreas';

describe('isValidDeliveryPostcode', () => {
  describe('valid postcodes', () => {
    it('should accept valid Kent postcodes', () => {
      expect(isValidDeliveryPostcode('BR1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('CT1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('DA1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('ME1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('TN1 1AA')).toBe(true);
    });

    it('should accept valid East Sussex postcodes', () => {
      expect(isValidDeliveryPostcode('BN1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('BN2 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('BN3 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('BN7 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('BN10 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('BN20 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('TN19 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('TN40 1AA')).toBe(true);
    });

    it('should accept valid Central and South London postcodes', () => {
      expect(isValidDeliveryPostcode('EC1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('WC1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('SE1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('SW1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('CR0 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('SM1 1AA')).toBe(true);
    });

    it('should handle postcodes without spaces', () => {
      expect(isValidDeliveryPostcode('BN11AA')).toBe(true); // BN1 is valid (outward code extraction)
      expect(isValidDeliveryPostcode('bn1 1aa')).toBe(true); // lowercase
      expect(isValidDeliveryPostcode('BN1')).toBe(true);
    });
  });

  describe('invalid postcodes', () => {
    it('should reject postcodes outside delivery areas', () => {
      expect(isValidDeliveryPostcode('N5 2QT')).toBe(false); // North London
      expect(isValidDeliveryPostcode('M1 1AA')).toBe(false); // Manchester
      expect(isValidDeliveryPostcode('B1 1AA')).toBe(false); // Birmingham
    });

    it('should reject BN11 (Worthing, West Sussex) - bug fix test', () => {
      // BN11 is Worthing, West Sussex, NOT East Sussex
      // This test ensures BN11 does NOT incorrectly match BN1
      expect(isValidDeliveryPostcode('BN11 1AA')).toBe(false);
      expect(isValidDeliveryPostcode('BN11')).toBe(false);
      // Note: "BN11AA" without space parses as "BN1" + "1AA" which is valid
      // To test the bug fix, we use "BN11" (outward code only) or "BN11 1AA" (with space)
      expect(isValidDeliveryPostcode('BN11 1AA')).toBe(false);
    });

    it('should reject other BN postcodes not in delivery areas', () => {
      // BN4-BN6, BN11-BN19 are not in the delivery areas
      expect(isValidDeliveryPostcode('BN4 1AA')).toBe(false);
      expect(isValidDeliveryPostcode('BN5 1AA')).toBe(false);
      expect(isValidDeliveryPostcode('BN6 1AA')).toBe(false);
      expect(isValidDeliveryPostcode('BN12 1AA')).toBe(false);
      expect(isValidDeliveryPostcode('BN13 1AA')).toBe(false);
      expect(isValidDeliveryPostcode('BN19 1AA')).toBe(false);
    });

    it('should reject invalid postcode formats', () => {
      expect(isValidDeliveryPostcode('')).toBe(false);
      expect(isValidDeliveryPostcode('123')).toBe(false);
      expect(isValidDeliveryPostcode('ABC')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle postcodes with different spacing', () => {
      expect(isValidDeliveryPostcode('BN1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('BN1  1AA')).toBe(true); // double space
      // "BN11AA" without space parses as "BN1" + "1AA" which is valid
      // The bug fix ensures "BN11" (outward code) doesn't match "BN1"
      expect(isValidDeliveryPostcode('BN11AA')).toBe(true); // Parses as BN1 + 1AA
    });

    it('should not allow partial matches that would cause false positives', () => {
      // Ensure that postcodes starting with valid prefixes don't incorrectly match
      // e.g., BN11 should not match BN1
      expect(isValidDeliveryPostcode('BN1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('BN11 1AA')).toBe(false); // BN11 is not in delivery areas
      
      // Similar edge cases for other postcodes
      expect(isValidDeliveryPostcode('CT1 1AA')).toBe(true);
      expect(isValidDeliveryPostcode('CT11 1AA')).toBe(true); // CT11 is valid
      // CT111 with space: outward code would be "CT111" which doesn't match pattern
      // Without space "CT1111AA" would parse as "CT11" + "1AA" which is valid
      expect(isValidDeliveryPostcode('CT111 1AA')).toBe(false); // CT111 doesn't exist
    });
  });
});

