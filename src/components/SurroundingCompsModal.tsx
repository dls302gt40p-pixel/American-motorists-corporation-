import React, { useState } from 'react';
import { Car, SurroundingComp } from '../types/car';
import { formatCurrency, formatMiles } from '../utils/formatters';
import { 
  X, 
  MapPin, 
  Layers, 
  Building2, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface SurroundingCompsModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (car: Car) => void;
}

export const SurroundingCompsModal: React.FC<SurroundingCompsModalProps> = ({
  car,
  isOpen,
  onClose,
  onSelectVehicle,
}) => {
  const [maxRadius, setMaxRadius] = useState<number>(50);

  if (!isOpen || !car) return null;

  const {
    year,
    make,
    model,
    trim,
    pricing,
    surroundingComps,
    brandNewComparison,
    exactColor,
  } = car;

  const filteredComps = surroundingComps.filter(
    (c) => c.distanceMiles <= maxRadius
  );

  const prices = [pricing.dealerPrice, ...filteredComps.map((c) => c.price)];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(
    filteredComps.reduce((acc, c) => acc + c.price, 0) / (filteredComps.length || 1)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Surrounding Area Price Intelligence
                </h2>
                <span className="text-xs bg-slate-800 border border-slate-700 text-slate-300 font-mono px-2 py-0.5 rounded">
                  Same Model Match
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {year} {make} {model} {trim} · Exact comps within radius
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Brand New vs This Car vs Surrounding Area Price Matrix */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-slate-400 block">
                  PRICE SPECTRUM: THIS CAR VS SURROUNDING DEALERS VS BRAND NEW
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  Market Context for {make} {model}
                </span>
              </div>

              {/* Radius filter selector */}
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400">Search Radius:</span>
                <select
                  value={maxRadius}
                  onChange={(e) => setMaxRadius(Number(e.target.value))}
                  aria-label="Filter surrounding area radius in miles"
                  className="bg-transparent text-amber-400 font-medium focus:outline-none cursor-pointer"
                >
                  <option value={15} className="bg-slate-900 text-white">15 Miles</option>
                  <option value={25} className="bg-slate-900 text-white">25 Miles</option>
                  <option value={50} className="bg-slate-900 text-white">50 Miles</option>
                  <option value={100} className="bg-slate-900 text-white">100 Miles</option>
                  <option value={250} className="bg-slate-900 text-white">250 Miles</option>
                </select>
              </div>
            </div>

            {/* Visual 3-Way Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Card 1: Current Dealership Car */}
              <div className="bg-slate-900/90 border-2 border-blue-500/80 rounded-xl p-3.5 space-y-2 relative">
                <span className="absolute top-2 right-2 text-[10px] uppercase font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.5 rounded">
                  THIS VEHICLE
                </span>
                <div className="text-xs text-slate-400 font-medium">
                  {car.dealership.name} ({car.dealership.distanceMiles} mi)
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {formatCurrency(pricing.dealerPrice)}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {formatMiles(car.mileage)} · {exactColor.exteriorName}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold pt-1 border-t border-slate-800">
                  {pricing.dealerPrice <= avgPrice ? (
                    `${formatCurrency(avgPrice - pricing.dealerPrice)} below regional average`
                  ) : (
                    `${formatCurrency(pricing.dealerPrice - avgPrice)} above regional average`
                  )}
                </div>
              </div>

              {/* Card 2: Surrounding Area Average */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                  REGIONAL AVERAGE ({filteredComps.length} COMPS)
                </span>
                <div className="text-xs text-slate-400 font-medium">
                  Within {maxRadius} Miles Radius
                </div>
                <div className="text-2xl font-black text-slate-200 font-mono">
                  {formatCurrency(avgPrice)}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Range: {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                  Across verified regional franchises
                </div>
              </div>

              {/* Card 3: Brand New Model Comparison */}
              <div className="bg-slate-900/90 border border-amber-500/40 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block">
                    BRAND NEW {brandNewComparison.brandNewYear}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {brandNewComparison.newFinanceRateAPR}% APR
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-medium">
                  Configured Sticker MSRP
                </div>
                <div className="text-2xl font-black text-amber-300 font-mono">
                  {formatCurrency(brandNewComparison.brandNewConfiguredMSRP)}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Gap: {formatCurrency(brandNewComparison.priceDelta)} ({brandNewComparison.percentDifference.toFixed(1)}%)
                </div>
                <div className={`text-[11px] font-semibold pt-1 border-t border-slate-800 ${
                  brandNewComparison.verdict === 'Almost Same Price (Caution)'
                    ? 'text-rose-400'
                    : 'text-emerald-400'
                }`}>
                  {brandNewComparison.verdict}
                </div>
              </div>
            </div>

            {/* Caution Callout if used price is almost same as new */}
            {brandNewComparison.verdict === 'Almost Same Price (Caution)' && (
              <div className="mt-3 p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">BUYER CAUTION: Close to Brand New Price</span>
                  <span className="text-[11px] leading-relaxed text-slate-300">
                    {brandNewComparison.verdictReason}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Surrounding Dealership Comps Detailed Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>Active Listings at Surrounding Dealerships ({filteredComps.length})</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Sorted by Distance
              </span>
            </div>

            <div className="space-y-2.5">
              {filteredComps.map((comp) => {
                const isCheaper = comp.deltaAgainstCurrent < 0;
                return (
                  <div
                    key={comp.id}
                    className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div 
                        className="w-4 h-4 rounded-full border border-white/20 mt-1 shrink-0" 
                        style={{ backgroundColor: comp.colorHex }}
                        title={comp.colorName}
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">
                            {comp.dealershipName}
                          </span>
                          <span className="text-xs text-slate-400">
                            {comp.city}, {comp.state}
                          </span>
                          <span className="text-xs font-mono text-amber-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                            {comp.distanceMiles} mi away
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                          <span>{formatMiles(comp.mileage)}</span>
                          <span>·</span>
                          <span className="text-slate-300">{comp.colorName}</span>
                          <span>·</span>
                          <span className="text-slate-500">VIN: ...{comp.vin.slice(-6)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Delta */}
                    <div className="flex items-center sm:items-end justify-between sm:flex-col gap-1 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                      <div className="text-lg font-black text-white font-mono">
                        {formatCurrency(comp.price)}
                      </div>
                      <div className={`text-xs font-mono font-semibold ${
                        isCheaper ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {comp.deltaAgainstCurrent === 0 ? (
                          'Same as current'
                        ) : isCheaper ? (
                          `Save ${formatCurrency(Math.abs(comp.deltaAgainstCurrent))} vs this car`
                        ) : (
                          `+${formatCurrency(comp.deltaAgainstCurrent)} higher than this car`
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Current vehicle dealership: <span className="text-white font-semibold">{car.dealership.name}</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Comps
          </button>
        </div>
      </div>
    </div>
  );
};
