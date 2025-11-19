export const DELIVERY_AREAS = {
  KENT: {
    name: 'Kent',
    postcodes: [
      'BR1', 'BR2', 'BR3', 'BR4', 'BR5', 'BR6', 'BR7', 'BR8', // Bromley
      'CT1', 'CT2', 'CT3', 'CT4', 'CT5', 'CT6', 'CT7', 'CT8', 'CT9', 'CT10', 'CT11', 'CT12', 'CT13', 'CT14', 'CT15', 'CT16', 'CT17', 'CT18', 'CT19', 'CT20', 'CT21', // Canterbury, Whitstable, Herne Bay, Margate, Ramsgate, Dover, Folkestone, Hythe
      'DA1', 'DA2', 'DA3', 'DA4', 'DA5', 'DA6', 'DA7', 'DA8', 'DA9', 'DA10', 'DA11', 'DA12', 'DA13', 'DA14', 'DA15', 'DA16', 'DA17', 'DA18', // Dartford, Erith, Gravesend, Sidcup
      'ME1', 'ME2', 'ME3', 'ME4', 'ME5', 'ME6', 'ME7', 'ME8', 'ME9', 'ME10', 'ME11', 'ME12', 'ME13', 'ME14', 'ME15', 'ME16', 'ME17', 'ME18', 'ME19', 'ME20', // Medway, Rochester, Chatham, Gillingham, Maidstone, Sittingbourne
      'TN1', 'TN2', 'TN3', 'TN4', 'TN5', 'TN6', 'TN7', 'TN8', 'TN9', 'TN10', 'TN11', 'TN12', 'TN13', 'TN14', 'TN15', 'TN16', 'TN17', 'TN18', 'TN23', 'TN24', 'TN25', 'TN26', 'TN27', 'TN28', 'TN29', 'TN30', // Tunbridge Wells, Sevenoaks, Tonbridge, Ashford, Tenterden
    ]
  },
  EAST_SUSSEX: {
    name: 'East Sussex',
    postcodes: [
      'BN1', 'BN2', 'BN3', // Brighton (on border)
      'BN7', 'BN8', 'BN9', 'BN10', // Lewes, Newhaven, Peacehaven
      'BN20', 'BN21', 'BN22', 'BN23', 'BN24', 'BN25', 'BN26', 'BN27', // Eastbourne, Hailsham
      'TN19', 'TN20', 'TN21', 'TN22', // Burwash, Mayfield, Heathfield, Uckfield
      'TN31', 'TN32', 'TN33', 'TN34', 'TN35', 'TN36', 'TN37', 'TN38', 'TN39', 'TN40', // Rye, Robertsbridge, Battle, Hastings, St Leonards, Bexhill
    ]
  },
  CENTRAL_SOUTH_LONDON: {
    name: 'Central and South London',
    postcodes: [
      // Central London
      'EC1', 'EC2', 'EC3', 'EC4', // City of London
      'WC1', 'WC2', // West Central London
      'E1', 'E2', 'E3', 'E8', 'E9', 'E14', // East London (Tower Hamlets, Hackney)
      // South London
      'SE1', 'SE2', 'SE3', 'SE4', 'SE5', 'SE6', 'SE7', 'SE8', 'SE9', 'SE10', 'SE11', 'SE12', 'SE13', 'SE14', 'SE15', 'SE16', 'SE17', 'SE18', 'SE19', 'SE20', 'SE21', 'SE22', 'SE23', 'SE24', 'SE25', 'SE26', 'SE27', 'SE28', // South East London
      'SW1', 'SW2', 'SW3', 'SW4', 'SW5', 'SW6', 'SW7', 'SW8', 'SW9', 'SW10', 'SW11', 'SW12', 'SW13', 'SW14', 'SW15', 'SW16', 'SW17', 'SW18', 'SW19', 'SW20', // South West London
      'CR0', 'CR2', 'CR4', 'CR5', 'CR7', 'CR8', // Croydon
      'SM1', 'SM2', 'SM3', 'SM4', 'SM5', 'SM6', 'SM7', // Sutton, Morden
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