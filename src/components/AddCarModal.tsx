import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Car as CarIcon, 
  CheckCircle2, 
  Image as ImageIcon, 
  DollarSign, 
  Gauge, 
  ShieldCheck, 
  MapPin, 
  Palette,
  Sparkles
} from 'lucide-react';
import { Car, DrivetrainType } from '../types/car';

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCar: (newCar: Car) => void;
}

export const AddCarModal: React.FC<AddCarModalProps> = ({
  isOpen,
  onClose,
  onAddCar,
}) => {
  // Form fields
  const [year, setYear] = useState<number>(2024);
  const [make, setMake] = useState<string>('Chevrolet');
  const [model, setModel] = useState<string>('Corvette Stingray');
  const [trim, setTrim] = useState<string>('3LT Coupe');
  const [bodyStyle, setBodyStyle] = useState<'Coupe' | 'Sedan' | 'SUV' | 'Wagon' | 'Hatchback' | 'Truck'>('Coupe');
  const [price, setPrice] = useState<number>(79900);
  const [msrp, setMsrp] = useState<number>(85500);
  const [mileage, setMileage] = useState<number>(4200);
  const [vin, setVin] = useState<string>('1G1YB2D39R' + Math.floor(100000 + Math.random() * 900000));
  
  // Power specs
  const [horsepower, setHorsepower] = useState<number>(495);
  const [torque, setTorque] = useState<number>(470);
  const [zeroToSixty, setZeroToSixty] = useState<number>(2.9);
  const [engine, setEngine] = useState<string>('6.2L LT2 Naturally Aspirated V8');
  const [transmission, setTransmission] = useState<string>('8-Speed Dual-Clutch Automatic');
  const [drivetrain, setDrivetrain] = useState<DrivetrainType>('RWD');

  // Exact Color
  const [exteriorName, setExteriorName] = useState<string>('Torch Red');
  const [exteriorHex, setExteriorHex] = useState<string>('#D11D27');
  const [interiorName, setInteriorName] = useState<string>('Jet Black w/ Adrenaline Red Stitching');

  // Dealership
  const [dealerName, setDealerName] = useState<string>('Premier Performance Motors');
  const [dealerCity, setDealerCity] = useState<string>('Los Angeles');
  const [dealerState, setDealerState] = useState<string>('CA');

  // Media
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [uploadError, setUploadError] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    setUploadError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImagePreview(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const activeImage = imagePreview || imageUrlInput || '/src/assets/images/corvette_z06_red_1791142533631.jpg';

    const newCar: Car = {
      id: `car-${Date.now()}`,
      year: Number(year),
      make: make.trim(),
      model: model.trim(),
      trim: trim.trim(),
      bodyStyle,
      vin: vin.trim() || '1G1YB2D39R' + Math.floor(100000 + Math.random() * 900000),
      stockNumber: `STK-${Math.floor(1000 + Math.random() * 9000)}`,
      mileage: Number(mileage),
      drivetrain,
      transmission,
      engine,
      horsepower: Number(horsepower),
      torque: Number(torque),
      zeroToSixty: Number(zeroToSixty),
      topSpeedMph: 190,
      fuelEconomy: {
        city: 16,
        highway: 24,
        combined: 19,
        fuelType: 'Premium Unleaded',
      },
      exactColor: {
        exteriorName: exteriorName.trim(),
        exteriorCode: 'EX-01',
        exteriorHex,
        finish: 'Gloss',
        interiorName: interiorName.trim(),
        interiorHex: '#1E1E1E',
        interiorMaterial: 'Mulan Leather / Microfiber Suede',
      },
      dealership: {
        name: dealerName.trim(),
        address: '100 Automotive Blvd',
        city: dealerCity.trim(),
        state: dealerState.trim().toUpperCase(),
        zip: '90001',
        distanceMiles: 8.5,
        phone: '(555) 234-5678',
        website: 'https://example.com',
        rating: 4.9,
        reviewCount: 420,
        badge: 'Premier Certified Center',
      },
      pricing: {
        msrp: Number(msrp),
        dealerPrice: Number(price),
        discountOrMarkup: Number(price) - Number(msrp),
        docFee: 85,
        destinationFee: 1295,
        dealGrade: Number(price) < Number(msrp) ? 'Great Deal' : 'Fair Deal',
        savingsBelowRegionalAvg: 2400,
      },
      brandNewComparison: {
        brandNewYear: Number(year) + 2,
        brandNewModelName: `${make} ${model} New Generation`,
        brandNewStartingMSRP: Number(msrp) + 4000,
        brandNewConfiguredMSRP: Number(msrp) + 9500,
        priceDelta: Number(msrp) + 9500 - Number(price),
        percentDifference: 12.5,
        verdict: 'Strong Used Value',
        verdictReason: `Saves $${(Number(msrp) + 9500 - Number(price)).toLocaleString()} compared to ordering brand new with immediate lot delivery.`,
        newFinanceRateAPR: 3.99,
        usedFinanceRateAPR: 7.29,
        estimatedNewMonthlyPayment: 1450,
        estimatedUsedMonthlyPayment: 1280,
        warrantyComparison: {
          newWarrantyMonths: 48,
          newWarrantyMiles: 50000,
          remainingWarrantyMonths: 32,
          remainingWarrantyMiles: 38000,
        },
      },
      surroundingComps: [
        {
          id: `comp-${Date.now()}-1`,
          dealershipName: `${dealerName} Competitor`,
          city: dealerCity,
          state: dealerState,
          distanceMiles: 14.2,
          price: Number(price) + 2100,
          mileage: Number(mileage) + 1800,
          colorName: exteriorName,
          colorHex: exteriorHex,
          vin: 'WBA33AY06RFK91890',
          deltaAgainstCurrent: 2100,
          dealScore: 'Fair Deal',
        },
      ],
      mmr: {
        wholesaleAverage: Math.round(Number(price) * 0.91),
        estimatedAuctionRange: [Math.round(Number(price) * 0.88), Math.round(Number(price) * 0.94)],
        autoGrade: 4.9,
        gradeCondition: 'Extra Clean',
        wholesaleVolume30Days: 32,
        historicalTrendPercent: -0.5,
        wholesaleToRetailMargin: Math.round(Number(price) * 0.09),
        projectedDepreciation1Yr: 4500,
      },
      tradeInValue: {
        clean: Math.round(Number(price) * 0.89),
        average: Math.round(Number(price) * 0.85),
        rough: Math.round(Number(price) * 0.79),
        recommendedInstantOffer: Math.round(Number(price) * 0.88),
        retailPrivateParty: Math.round(Number(price) * 0.98),
      },
      carfax: {
        reportId: `CFX-${Date.now().toString().slice(-6)}`,
        vin: vin.trim(),
        cleanTitle: true,
        accidentCount: 0,
        accidents: [],
        ownerCount: 1,
        owners: [
          {
            ownerIndex: 1,
            yearPurchased: Number(year),
            typeOfUse: 'Personal Vehicle',
            location: `${dealerCity}, ${dealerState}`,
            lengthOwnedYears: 1.2,
            estimatedMilesPerYear: 3800,
            lastReportedOdometer: Number(mileage),
          },
        ],
        serviceRecordCount: 3,
        serviceHistory: [
          {
            date: 'Recent Inspection',
            mileage: Number(mileage),
            serviceProvider: dealerName,
            cityState: `${dealerCity}, ${dealerState}`,
            servicesPerformed: [
              '150-Point Certified Multipoint Inspection',
              'Synthetic oil & filter changed',
              'Fluid levels checked and topped off',
            ],
          },
        ],
        openRecalls: 0,
        recallsList: [],
        odometerStatus: 'Accurate & Verified',
        lastOdometerReading: Number(mileage),
        buybackGuaranteeEligible: true,
      },
      imageUrl: activeImage,
      galleryImages: [activeImage],
      keyFeatures: [
        `${horsepower} HP / ${torque} LB-FT Performance Tuned`,
        `${drivetrain} High-Performance Drivetrain`,
        `${transmission}`,
        'Factory Navigation & Premium Audio System',
        'Clean CARFAX 1-Owner Certified',
      ],
    };

    onAddCar(newCar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <CarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white font-mono flex items-center gap-2">
                ADD VEHICLE & UPLOAD PHOTOS
              </h3>
              <p className="text-xs text-slate-400">
                Publish a new car with custom pictures directly to your live inventory.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* 1. Image Upload Section */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Vehicle Photo (Upload File or Enter URL)</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Upload Box */}
              <label className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all group">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-amber-400 mb-2 transition-colors" />
                <span className="text-xs font-bold text-white mb-0.5">Click to Upload Photo</span>
                <span className="text-[10px] text-slate-400">PNG, JPG, WEBP from your phone or computer</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Photo Preview Box */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center min-h-[110px] relative">
                {imagePreview || imageUrlInput ? (
                  <img
                    src={imagePreview || imageUrlInput}
                    alt="Car preview"
                    className="w-full h-full object-cover max-h-[140px]"
                  />
                ) : (
                  <div className="text-center p-3 text-slate-500 text-xs">
                    No photo selected yet
                  </div>
                )}
                {(imagePreview || imageUrlInput) && (
                  <span className="absolute bottom-2 right-2 bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                    ✓ Photo Ready
                  </span>
                )}
              </div>
            </div>

            {uploadError && (
              <p className="text-xs text-rose-400">{uploadError}</p>
            )}

            {/* URL Fallback Input */}
            <div className="pt-1">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Or paste an image web link (e.g., https://...)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          {/* 2. Core Vehicle Info */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Vehicle Identity
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Year</label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Make</label>
                <input
                  type="text"
                  required
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  placeholder="e.g. Chevrolet"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Model</label>
                <input
                  type="text"
                  required
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. Corvette Z06"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Trim</label>
                <input
                  type="text"
                  required
                  value={trim}
                  onChange={(e) => setTrim(e.target.value)}
                  placeholder="e.g. 3LZ Coupe"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Body Style</label>
                <select
                  value={bodyStyle}
                  onChange={(e) => setBodyStyle(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                >
                  <option value="Coupe">Coupe</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Wagon">Wagon</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Mileage</label>
                <input
                  type="number"
                  required
                  value={mileage}
                  onChange={(e) => setMileage(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Dealer Price ($)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-amber-500/60 rounded-lg px-2.5 py-1.5 text-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Original MSRP ($)</label>
                <input
                  type="number"
                  required
                  value={msrp}
                  onChange={(e) => setMsrp(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Color Specs */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>Exact Color Specifications</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Exterior Paint Name</label>
                <input
                  type="text"
                  required
                  value={exteriorName}
                  onChange={(e) => setExteriorName(e.target.value)}
                  placeholder="e.g. Torch Red"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Color Swatch (Hex)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={exteriorHex}
                    onChange={(e) => setExteriorHex(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={exteriorHex}
                    onChange={(e) => setExteriorHex(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Interior Upholstery</label>
                <input
                  type="text"
                  value={interiorName}
                  onChange={(e) => setInteriorName(e.target.value)}
                  placeholder="e.g. Black Leather / Red Stitch"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* 4. Horsepower & Mechanics */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              <span>Horsepower, Engine & Mechanics</span>
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Horsepower (HP)</label>
                <input
                  type="number"
                  required
                  value={horsepower}
                  onChange={(e) => setHorsepower(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Torque (LB-FT)</label>
                <input
                  type="number"
                  required
                  value={torque}
                  onChange={(e) => setTorque(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">0-60 MPH (Sec)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={zeroToSixty}
                  onChange={(e) => setZeroToSixty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Drivetrain</label>
                <select
                  value={drivetrain}
                  onChange={(e) => setDrivetrain(e.target.value as DrivetrainType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                >
                  <option value="AWD">AWD</option>
                  <option value="RWD">RWD</option>
                  <option value="FWD">FWD</option>
                  <option value="4WD">4WD</option>
                </select>
              </div>
            </div>
          </div>

          {/* 5. Dealership & Location */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dealership & Location</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Dealership Name</label>
                <input
                  type="text"
                  required
                  value={dealerName}
                  onChange={(e) => setDealerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">City</label>
                <input
                  type="text"
                  required
                  value={dealerCity}
                  onChange={(e) => setDealerCity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">State (e.g. CA, TX, FL)</label>
                <input
                  type="text"
                  maxLength={2}
                  required
                  value={dealerState}
                  onChange={(e) => setDealerState(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-lg text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Publish Car to Live Inventory</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
