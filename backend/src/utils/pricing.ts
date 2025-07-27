// US States with coordinates for distance calculation
export const US_STATES = {
  'AL': { name: 'Alabama', lat: 32.3182, lng: -86.9023 },
  'AK': { name: 'Alaska', lat: 63.5887, lng: -154.4931 },
  'AZ': { name: 'Arizona', lat: 33.7298, lng: -111.4312 },
  'AR': { name: 'Arkansas', lat: 35.2019, lng: -91.8318 },
  'CA': { name: 'California', lat: 36.7783, lng: -119.4179 },
  'CO': { name: 'Colorado', lat: 39.5501, lng: -105.7821 },
  'CT': { name: 'Connecticut', lat: 41.6032, lng: -73.0877 },
  'DE': { name: 'Delaware', lat: 39.3185, lng: -75.5071 },
  'FL': { name: 'Florida', lat: 27.6648, lng: -81.5158 },
  'GA': { name: 'Georgia', lat: 32.1656, lng: -82.9001 },
  'HI': { name: 'Hawaii', lat: 19.8968, lng: -155.5828 },
  'ID': { name: 'Idaho', lat: 44.2405, lng: -114.4788 },
  'IL': { name: 'Illinois', lat: 40.3495, lng: -88.9861 },
  'IN': { name: 'Indiana', lat: 39.8494, lng: -86.2583 },
  'IA': { name: 'Iowa', lat: 42.0329, lng: -93.2328 },
  'KS': { name: 'Kansas', lat: 38.5266, lng: -96.7265 },
  'KY': { name: 'Kentucky', lat: 37.6681, lng: -84.6701 },
  'LA': { name: 'Louisiana', lat: 31.1695, lng: -91.8678 },
  'ME': { name: 'Maine', lat: 44.6939, lng: -69.3819 },
  'MD': { name: 'Maryland', lat: 39.0639, lng: -76.8021 },
  'MA': { name: 'Massachusetts', lat: 42.2304, lng: -71.5301 },
  'MI': { name: 'Michigan', lat: 44.3148, lng: -85.6024 },
  'MN': { name: 'Minnesota', lat: 46.7296, lng: -94.6859 },
  'MS': { name: 'Mississippi', lat: 32.7416, lng: -89.6787 },
  'MO': { name: 'Missouri', lat: 38.4561, lng: -92.2884 },
  'MT': { name: 'Montana', lat: 46.8797, lng: -110.3626 },
  'NE': { name: 'Nebraska', lat: 41.4925, lng: -99.9018 },
  'NV': { name: 'Nevada', lat: 38.8026, lng: -116.4194 },
  'NH': { name: 'New Hampshire', lat: 43.1939, lng: -71.5724 },
  'NJ': { name: 'New Jersey', lat: 40.0583, lng: -74.4057 },
  'NM': { name: 'New Mexico', lat: 34.5199, lng: -105.8701 },
  'NY': { name: 'New York', lat: 42.1657, lng: -74.9481 },
  'NC': { name: 'North Carolina', lat: 35.7596, lng: -79.0193 },
  'ND': { name: 'North Dakota', lat: 47.5515, lng: -101.0020 },
  'OH': { name: 'Ohio', lat: 40.4173, lng: -82.9071 },
  'OK': { name: 'Oklahoma', lat: 35.0078, lng: -97.0929 },
  'OR': { name: 'Oregon', lat: 44.5720, lng: -122.0709 },
  'PA': { name: 'Pennsylvania', lat: 40.5908, lng: -77.2098 },
  'RI': { name: 'Rhode Island', lat: 41.6809, lng: -71.5118 },
  'SC': { name: 'South Carolina', lat: 33.8569, lng: -80.9450 },
  'SD': { name: 'South Dakota', lat: 44.2998, lng: -99.4388 },
  'TN': { name: 'Tennessee', lat: 35.7478, lng: -86.6923 },
  'TX': { name: 'Texas', lat: 31.9686, lng: -99.9018 },
  'UT': { name: 'Utah', lat: 39.3210, lng: -111.0937 },
  'VT': { name: 'Vermont', lat: 44.5588, lng: -72.5778 },
  'VA': { name: 'Virginia', lat: 37.4316, lng: -78.6569 },
  'WA': { name: 'Washington', lat: 47.7511, lng: -120.7401 },
  'WV': { name: 'West Virginia', lat: 38.5976, lng: -80.4549 },
  'WI': { name: 'Wisconsin', lat: 44.3148, lng: -89.6385 },
  'WY': { name: 'Wyoming', lat: 42.7475, lng: -107.2085 }
};

// Package size definitions
export const PACKAGE_SIZES = {
  small: {
    name: 'Small',
    maxWeight: 5, // lbs
    maxDimensions: { length: 12, width: 9, height: 6 }, // inches
    basePrice: 8
  },
  medium: {
    name: 'Medium',
    maxWeight: 20,
    maxDimensions: { length: 18, width: 14, height: 12 },
    basePrice: 12
  },
  large: {
    name: 'Large',
    maxWeight: 50,
    maxDimensions: { length: 24, width: 18, height: 18 },
    basePrice: 18
  },
  xlarge: {
    name: 'Extra Large',
    maxWeight: 100,
    maxDimensions: { length: 36, width: 24, height: 24 },
    basePrice: 25
  }
};

// Speed options
export const SPEED_OPTIONS = {
  standard: {
    name: 'Standard',
    days: 5,
    multiplier: 1.0,
    description: '5-7 business days'
  },
  express: {
    name: 'Express',
    days: 3,
    multiplier: 1.3,
    description: '3-5 business days'
  },
  overnight: {
    name: 'Overnight',
    days: 1,
    multiplier: 2.0,
    description: 'Next business day'
  }
};

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate shipping cost
export function calculateShippingCost(
  originState: string,
  destinationState: string,
  packageSize: keyof typeof PACKAGE_SIZES,
  weight: number,
  speed: keyof typeof SPEED_OPTIONS
): {
  baseCost: number;
  distanceCost: number;
  weightCost: number;
  speedCost: number;
  totalCost: number;
  distance: number;
  estimatedDays: number;
} {
  const origin = US_STATES[originState as keyof typeof US_STATES];
  const destination = US_STATES[destinationState as keyof typeof US_STATES];
  
  if (!origin || !destination) {
    throw new Error('Invalid state code');
  }

  const distance = calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
  const sizeInfo = PACKAGE_SIZES[packageSize];
  const speedInfo = SPEED_OPTIONS[speed];

  // Base cost from package size
  const baseCost = sizeInfo.basePrice;

  // Distance cost ($0.15 per mile - more realistic)
  const distanceCost = distance * 0.15;

  // Weight cost (additional $0.50 per lb over base weight - more realistic)
  const weightOverBase = Math.max(0, weight - sizeInfo.maxWeight);
  const weightCost = weightOverBase * 0.5;

  // Speed multiplier
  const speedCost = (baseCost + distanceCost + weightCost) * (speedInfo.multiplier - 1);

  const totalCost = baseCost + distanceCost + weightCost + speedCost;

  return {
    baseCost,
    distanceCost,
    weightCost,
    speedCost,
    totalCost: Math.round(totalCost * 100) / 100,
    distance: Math.round(distance * 10) / 10,
    estimatedDays: speedInfo.days
  };
}

// Get available states
export function getAvailableStates() {
  return Object.entries(US_STATES).map(([code, data]) => ({
    code,
    name: data.name,
    coordinates: { lat: data.lat, lng: data.lng }
  }));
}

// Get package size options
export function getPackageSizes() {
  return Object.entries(PACKAGE_SIZES).map(([key, data]) => ({
    key,
    name: data.name,
    maxWeight: data.maxWeight,
    maxDimensions: data.maxDimensions,
    basePrice: data.basePrice
  }));
}

// Get speed options
export function getSpeedOptions() {
  return Object.entries(SPEED_OPTIONS).map(([key, data]) => ({
    key,
    name: data.name,
    days: data.days,
    multiplier: data.multiplier,
    description: data.description
  }));
} 