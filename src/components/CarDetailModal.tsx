import React from 'react';
import { Car } from '../types/car';
import { formatCurrency, formatMiles, formatNumber } from '../utils/formatters';
import { 
  X, 
  Gauge, 
  Zap, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  Building2, 
  Phone, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Flame,
  Check
} from 'lucide-react';

interface CarDetailModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectForCarfax: (car: Car) => void;
  onOpenCarfaxReport: (car: Car) => void;
  onOpenCompsModal: (car: Car) => void;
  onOpenTradeModal: (car: Car) => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  isOpen,
  onClose,
  onSelectForCarfax,
  onOpenCarfaxReport,
  onOpenCompsModal,
  onOpenTradeModal,
}) => {
  if (!isOpen || !car) return null;

  const {
    year,
    make,
    model,
    trim,
    vin,
    stockNumber,
    mileage,
    drivetrain,
    transmission,
    engine,
    horsepower,
    torque,
    zeroToSixty,
    topSpeedMph,
    fuelEconomy,
    exactColor,
    dealership,
    pricing,
    brandNewComparison,
    surroundingComps,
    mmr,
    tradeInValue,
    carfax,
    imageUrl,
    keyFeatures,
  } = car;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>{year} {make}</span>
              <span>·</span>
              <span>Stock #{stockNumber}</span>
              <span>·</span>
              <span className="text-amber-400">VIN: {vin}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
              {make} {model} <span className="text-slate-400 text-base font-normal">{trim}</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onOpenCarfaxReport(car);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-md shadow-blue-500/20"
              title="Click to show the full Fax"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Click to Show Fax</span>
            </button>

            <button
              onClick={() => {
                onSelectForCarfax(car);
                onClose();
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors border border-slate-700"
            >
              <span>Dock to Side</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Visual & Key Stats Banner */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vehicle Image */}
            <div className="lg:col-span-2 relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={imageUrl}
                alt={`${year} ${make} ${model}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

              {/* Exact Color Badge */}
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-inner"
                    style={{ backgroundColor: exactColor.exteriorHex }}
                  />
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      FACTORY PAINT SPECS
                    </span>
                    <span className="font-bold text-white text-sm">
                      {exactColor.exteriorName}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-mono">
                      Paint Code: {exactColor.exteriorCode} · Finish: {exactColor.finish}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">
                    INTERIOR UPHOLSTERY
                  </span>
                  <span className="font-semibold text-amber-200 text-xs">
                    {exactColor.interiorName}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                    {exactColor.interiorMaterial}
                  </span>
                </div>
              </div>
            </div>

            {/* Price & Dealership Info */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block">
                  DEALER ASKING PRICE
                </span>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  {formatCurrency(pricing.dealerPrice)}
                </div>
                <div className="text-xs text-slate-400 font-mono mt-0.5">
                  Original MSRP: <span className="line-through">{formatCurrency(pricing.msrp)}</span>
                </div>
                {pricing.discountOrMarkup < 0 && (
                  <div className="mt-1 text-xs font-bold text-emerald-400 font-mono">
                    Total Savings: {formatCurrency(Math.abs(pricing.discountOrMarkup))}
                  </div>
                )}
              </div>

              {/* Dealership Details */}
              <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-200 font-bold">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>{dealership.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{dealership.address}, {dealership.city}, {dealership.state} ({dealership.distanceMiles} mi)</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 font-mono">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span>{dealership.phone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => onOpenCompsModal(car)}
                  className="w-full py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Layers className="w-4 h-4 text-blue-400" />
                  <span>Compare {surroundingComps.length} Surrounding Area Comps</span>
                </button>

                <button
                  onClick={() => onOpenTradeModal(car)}
                  className="w-full py-2.5 px-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Calculate Trade-In Equity</span>
                </button>
              </div>
            </div>
          </div>

          {/* Drivetrain & Performance Dyno Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Drivetrain & Powertrain Performance Specifications</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  DRIVETRAIN
                </span>
                <span className="text-xl font-black text-amber-400 block mt-1">
                  {drivetrain}
                </span>
                <span className="text-[10px] text-slate-500 block truncate font-sans mt-0.5">
                  Full Traction Control
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  HORSEPOWER
                </span>
                <span className="text-xl font-black text-white block mt-1">
                  {horsepower} <span className="text-xs font-normal text-slate-400">hp</span>
                </span>
                <span className="text-[10px] text-slate-500 block font-sans mt-0.5">
                  Peak Engine Output
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  TORQUE
                </span>
                <span className="text-xl font-black text-orange-400 block mt-1">
                  {torque} <span className="text-xs font-normal text-slate-400">lb-ft</span>
                </span>
                <span className="text-[10px] text-slate-500 block font-sans mt-0.5">
                  Low-End Pull
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  0-60 MPH
                </span>
                <span className="text-xl font-black text-emerald-400 block mt-1">
                  {zeroToSixty}s
                </span>
                <span className="text-[10px] text-slate-500 block font-sans mt-0.5">
                  Top Speed: {topSpeedMph} mph
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Engine Architecture:</span>
                <span className="font-semibold text-slate-200">{engine}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Transmission:</span>
                <span className="font-semibold text-slate-200">{transmission}</span>
              </div>
            </div>
          </div>

          {/* Brand New vs This Car Comparison Section */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>Brand New Model vs This Used Car Reality Check</span>
              </h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded font-mono ${
                brandNewComparison.verdict === 'Almost Same Price (Caution)'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {brandNewComparison.verdict}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {brandNewComparison.verdictReason}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Brand New {brandNewComparison.brandNewYear} Configured MSRP:</span>
                <span className="text-base font-bold text-white block mt-0.5">{formatCurrency(brandNewComparison.brandNewConfiguredMSRP)}</span>
                <span className="text-[11px] text-emerald-400 block mt-1">{brandNewComparison.newFinanceRateAPR}% Promo APR (~{formatCurrency(brandNewComparison.estimatedNewMonthlyPayment)}/mo)</span>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-amber-500/40">
                <span className="text-[10px] text-slate-400 block">This Used {year} Dealer Asking:</span>
                <span className="text-base font-bold text-amber-400 block mt-0.5">{formatCurrency(pricing.dealerPrice)}</span>
                <span className="text-[11px] text-slate-300 block mt-1">{brandNewComparison.usedFinanceRateAPR}% Used APR (~{formatCurrency(brandNewComparison.estimatedUsedMonthlyPayment)}/mo)</span>
              </div>
            </div>
          </div>

          {/* Key Factory Features */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Key Standard & Optional Equipment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {keyFeatures.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-slate-200">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onOpenCarfaxReport(car);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm shadow-blue-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Click to Show Full CARFAX</span>
            </button>

            <button
              onClick={() => {
                onSelectForCarfax(car);
                onClose();
              }}
              className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-white font-medium text-xs"
            >
              <span>Dock to Side</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
