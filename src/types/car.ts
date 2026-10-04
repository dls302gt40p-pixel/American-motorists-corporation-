export type DrivetrainType = 'AWD' | 'RWD' | 'FWD' | '4WD' | 'e-AWD';

export interface ExactColor {
  exteriorName: string;
  exteriorCode: string;
  exteriorHex: string;
  finish: 'Metallic' | 'Pearl' | 'Gloss' | 'Matte/Frozen';
  interiorName: string;
  interiorHex: string;
  interiorMaterial: string;
}

export interface Dealership {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  distanceMiles: number;
  phone: string;
  website: string;
  rating: number;
  reviewCount: number;
  badge?: string;
}

export interface SurroundingComp {
  id: string;
  dealershipName: string;
  city: string;
  state: string;
  distanceMiles: number;
  price: number;
  mileage: number;
  colorName: string;
  colorHex: string;
  vin: string;
  deltaAgainstCurrent: number; // e.g. -1500 (cheaper) or +1200 (more expensive)
  dealScore: 'Lowest in Area' | 'Great Deal' | 'Fair Deal' | 'Above Average';
}

export interface MMRReport {
  wholesaleAverage: number;
  estimatedAuctionRange: [number, number];
  autoGrade: number; // e.g. 4.8 / 5.0
  gradeCondition: 'Extra Clean' | 'Clean' | 'Average' | 'Rough';
  wholesaleVolume30Days: number;
  historicalTrendPercent: number; // e.g. -1.4%
  wholesaleToRetailMargin: number; // Difference between dealer price and MMR
  projectedDepreciation1Yr: number;
}

export interface TradeInValue {
  clean: number;
  average: number;
  rough: number;
  recommendedInstantOffer: number;
  retailPrivateParty: number;
}

export interface CarfaxRecord {
  reportId: string;
  vin: string;
  cleanTitle: boolean;
  accidentCount: number;
  accidents: Array<{
    date: string;
    severity: 'Minor' | 'Moderate' | 'Severe';
    impactPoint: string;
    details: string;
    airbagsDeployed: boolean;
    structuralDamage: boolean;
  }>;
  ownerCount: number;
  owners: Array<{
    ownerIndex: number;
    yearPurchased: number;
    typeOfUse: 'Personal Vehicle' | 'Lease' | 'Commercial' | 'Rental';
    location: string;
    lengthOwnedYears: number;
    estimatedMilesPerYear: number;
    lastReportedOdometer: number;
  }>;
  serviceRecordCount: number;
  serviceHistory: Array<{
    date: string;
    mileage: number;
    serviceProvider: string;
    cityState: string;
    servicesPerformed: string[];
  }>;
  openRecalls: number;
  recallsList: Array<{
    campaignNumber: string;
    component: string;
    summary: string;
    remedyStatus: 'Remedy Available' | 'No Remedy Yet' | 'Recall Completed';
  }>;
  odometerStatus: 'Accurate & Verified' | 'Discrepancy Detected';
  lastOdometerReading: number;
  buybackGuaranteeEligible: boolean;
}

export interface BrandNewComparison {
  brandNewYear: number;
  brandNewModelName: string;
  brandNewStartingMSRP: number;
  brandNewConfiguredMSRP: number;
  priceDelta: number; // configuredMSRP - dealerPrice
  percentDifference: number; // ((configuredMSRP - dealerPrice) / configuredMSRP) * 100
  verdict: 'Buy New Recommended' | 'Almost Same Price (Caution)' | 'Strong Used Value' | 'Moderate Used Savings';
  verdictReason: string;
  newFinanceRateAPR: number; // e.g. 3.49% promo APR on new
  usedFinanceRateAPR: number; // e.g. 7.29% standard used APR
  estimatedNewMonthlyPayment: number; // 60 mo, 10% down
  estimatedUsedMonthlyPayment: number; // 60 mo, 10% down
  warrantyComparison: {
    newWarrantyMonths: number;
    newWarrantyMiles: number;
    remainingWarrantyMonths: number;
    remainingWarrantyMiles: number;
  };
}

export interface Car {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  bodyStyle: 'Sedan' | 'Coupe' | 'SUV' | 'Wagon' | 'Hatchback' | 'Truck';
  vin: string;
  stockNumber: string;
  mileage: number;
  
  // Power & Mechanics
  drivetrain: DrivetrainType;
  transmission: string;
  engine: string;
  horsepower: number; // hp
  torque: number; // lb-ft
  zeroToSixty: number; // seconds
  topSpeedMph: number;
  fuelEconomy: {
    city: number;
    highway: number;
    combined: number;
    fuelType: 'Premium Unleaded' | 'Regular Unleaded' | 'Electric / Hybrid' | 'Diesel';
  };
  
  // Exact Color Specs
  exactColor: ExactColor;
  
  // Dealership
  dealership: Dealership;
  
  // Pricing
  pricing: {
    msrp: number;
    dealerPrice: number;
    discountOrMarkup: number; // negative is discount, positive is markup
    docFee: number;
    destinationFee: number;
    dealGrade: 'Great Deal' | 'Good Deal' | 'Fair Deal' | 'High Price';
    savingsBelowRegionalAvg: number;
  };

  // Brand New vs This Car Comparison Analysis
  brandNewComparison: BrandNewComparison;
  
  // Surrounding comps
  surroundingComps: SurroundingComp[];
  
  // MMR & Trade-In
  mmr: MMRReport;
  tradeInValue: TradeInValue;
  
  // Carfax
  carfax: CarfaxRecord;
  
  // Media & highlights
  imageUrl: string;
  galleryImages: string[];
  keyFeatures: string[];
}

export interface FilterState {
  searchQuery: string;
  make: string;
  drivetrain: string;
  minHp: number;
  maxHp: number;
  minTorque: number;
  maxTorque: number;
  maxPrice: number;
  maxDistance: number;
  colorFamily: string;
  onlyCleanCarfax: boolean;
  onlyOneOwner: boolean;
  sortBy: 'price-asc' | 'price-desc' | 'hp-desc' | 'torque-desc' | 'distance-asc' | 'mmr-margin-desc' | 'deal-score';
}
