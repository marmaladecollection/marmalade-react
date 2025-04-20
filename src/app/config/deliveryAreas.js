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
      'TN32', // Robertsbridge
      'TN33', // Battle
      'TN34', // Hastings
      'TN35', // St Leonards
      'TN36', // Winchelsea
      'TN37', // St Leonards
      'TN38', // St Leonards
      'TN39', // Bexhill
      'TN40', // Bexhill
      'TN31', // Rye
      'TN21', // Heathfield
      'TN20', // Mayfield
      'TN19', // Etchingham
      'TN5',  // Wadhurst
      'TN6',  // Crowborough
      'TN7',  // Hartfield
      'TN8',  // Edenbridge
      'TN22', // Uckfield
      'BN7',  // Lewes
      'BN8',  // Lewes
      'BN26', // Hailsham
      'BN27', // Hailsham
      'BN20', // Eastbourne
      'BN21', // Eastbourne
      'BN22', // Eastbourne
      'BN23', // Eastbourne
      'BN24', // Eastbourne
      'BN25', // Eastbourne
      // Kent
      'TN23', // Ashford
      'TN24', // Ashford
      'TN25', // Ashford
      'TN26', // Ashford
      'TN27', // Ashford
      'TN28', // New Romney
      'TN29', // Dymchurch
      'TN30', // Tenterden
      'TN17', // Cranbrook
      'TN18', // Hawkhurst
      'TN12', // Tonbridge
      'TN11', // Tonbridge
      'TN10', // Tonbridge
      'TN9',  // Tonbridge
      'TN2',  // Tunbridge Wells
      'TN3',  // Tunbridge Wells
      'TN4',  // Tunbridge Wells
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