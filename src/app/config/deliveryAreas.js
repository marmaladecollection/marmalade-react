export const DELIVERY_AREAS = {
  EAST_SUSSEX: {
    name: 'East Sussex',
    towns: ['Hastings', 'St Leonards', 'Bexhill', 'Battle', 'Rye'],
    postcodes: [
      'TN34', // Hastings
      'TN35', // St Leonards
      'TN39', // Bexhill
      'TN33', // Battle
      'TN31', // Rye
      // Add more specific postcodes as needed
    ]
  },
  KENT: {
    name: 'Kent',
    towns: ['Ashford', 'Tenterden'],
    postcodes: [
      'TN23', // Ashford
      'TN30', // Tenterden
      // Add more specific postcodes as needed
    ]
  },
  BRIGHTLING_20_MILE_RADIUS: {
    name: 'Brightling and Surrounding Areas',
    description: 'Areas within 20 miles of Brightling, East Sussex',
    postcodes: [
      // East Sussex
      'BN7',  // Lewes
      'BN8',  // Lewes
      'BN9',  // Newhaven
      'BN10', // Peacehaven
      'BN20', // Eastbourne
      'BN21', // Eastbourne
      'BN22', // Eastbourne
      'BN23', // Eastbourne
      'BN24', // Eastbourne
      'BN25', // Eastbourne
      'BN26', // Hailsham
      'BN27', // Hailsham
      'TN19', // Burwash, Etchingham
      'TN20', // Mayfield
      'TN21', // Heathfield
      'TN31', // Rye area
      'TN32', // Robertsbridge, Brightling
      'TN33', // Battle
      'TN34', // Hastings
      'TN35', // St Leonards
      'TN37', // St Leonards
      'TN38', // St Leonards
      'TN39', // Bexhill
      'TN40', // Bexhill
      // Kent
      'TN1',  // Tunbridge Wells
      'TN2',  // Tunbridge Wells
      'TN3',  // Tunbridge Wells
      'TN4',  // Tunbridge Wells
      'TN5',  // Wadhurst, Ticehurst
      'TN6',  // Crowborough
      'TN17', // Cranbrook
      'TN18', // Hawkhurst
    ]
  }
};

export const isValidDeliveryPostcode = (postcode) => {
  // Normalize the postcode (remove spaces and convert to uppercase)
  const normalizedPostcode = postcode.replace(/\s+/g, '').toUpperCase();
  
  // Check if the postcode matches any of our delivery areas
  return Object.values(DELIVERY_AREAS).some(area => 
    area.postcodes.some(validPostcode => 
      normalizedPostcode.startsWith(validPostcode)
    )
  );
}; 