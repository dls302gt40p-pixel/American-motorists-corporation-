import React, { useState } from 'react';
import { Car } from '../types/car';
import { USDealership } from '../data/usDealerships';
import { DealershipDirectorySideDock } from './DealershipDirectorySideDock';
import { formatCurrency, formatMiles, formatNumber } from '../utils/formatters';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Wrench, 
  Calendar, 
  MapPin, 
  UserCheck, 
  ExternalLink,
  Sparkles,
  TrendingDown,
  Percent,
  Layers,
  ChevronRight,
  Info,
  Car as CarIcon,
  Zap,
  Building2,
  Globe2,
  Truck
} from 'lucide-react';

interface CarfaxSidePanelProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenFullReport: (car: Car) => void;
  onOpenTradeModal: (car: Car) => void;
  onOpenCompsModal: (car: Car) => void;
  onOpenTransportModal?: (car: Car) => void;
  onSelectDealer?: (dealer: USDealership) => void;
  onFilterByBrand?: (brand: string) => void;
}

export const CarfaxSidePanel: React.FC<CarfaxSidePanelProps> = ({
  car,
  isOpen,
  onClose,
  onOpenFullReport,
  onOpenTradeModal,
  onOpenCompsModal,
  onOpenTransportModal,
  onSelectDealer,
  onFilterByBrand,
}) => {
  const [activeTab, setActiveTab] = useState<'carfax' | 'new-vs-used' | 'mmr' | 'dealers'>('carfax');

  if (!isOpen || !car) return null;

  const { carfax, brandNewComparison, mmr, pricing, exactColor } = car;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl flex flex-col shadow-2xl overflow-hidden max-h-[580px] transition-all duration-300">
      {/* Top Header */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-white font-mono tracking-wide">
                CARFAX<span className="text-blue-400">·VERIFIED</span>
              </span>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold">
                100% CLEAN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              VIN: {car.vin}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenFullReport(car)}
            className="flex items-center gap-1 px-2.5 py-1 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 rounded text-xs font-bold transition-colors"
            title="Click to show the full Fax"
          >
            <span>Show Fax</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close side panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Selected Car Snapshot Header Bar */}
      <div className="bg-slate-950/60 px-5 py-2.5 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 truncate pr-2">
          <div 
            className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0" 
            style={{ backgroundColor: exactColor.exteriorHex }}
            title={exactColor.exteriorName}
          />
          <span className="font-bold text-slate-200 truncate">
            {car.year} {car.make} {car.model}
          </span>
          <span className="text-slate-500 font-mono">({car.drivetrain})</span>
        </div>
        <div className="text-right shrink-0 font-mono font-bold text-amber-400">
          {formatCurrency(pricing.dealerPrice)}
        </div>
      </div>

      {/* Tab Switcher: Carfax vs New vs Used Reality Check vs MMR Wholesale */}
      <div className="flex items-center border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('carfax')}
          className={`flex-1 py-1.5 px-2 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'carfax'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>CARFAX History</span>
        </button>

        <button
          onClick={() => setActiveTab('new-vs-used')}
          className={`flex-1 py-1.5 px-2 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 relative ${
            activeTab === 'new-vs-used'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>New vs Used</span>
          {brandNewComparison.verdict === 'Almost Same Price (Caution)' && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-0.5" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('mmr')}
          className={`flex-1 py-1.5 px-2 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'mmr'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
          <span>MMR</span>
        </button>

        <button
          onClick={() => setActiveTab('dealers')}
          className={`flex-1 py-1.5 px-2 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'dealers'
              ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
          title="Browse all dealerships in the US A-Z & by brand"
        >
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          <span>US Dealers</span>
        </button>
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* ================= TAB 1: CARFAX REPORT ================= */}
        {activeTab === 'carfax' && (
          <div className="space-y-4">
            {/* Click to Show Official Fax Banner */}
            <button
              onClick={() => onOpenFullReport(car)}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-xs flex items-center justify-between shadow-lg shadow-blue-500/25 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <span className="block text-xs uppercase tracking-wider font-extrabold">
                    Click to Show Official CARFAX Report
                  </span>
                  <span className="block text-[10px] text-blue-100 font-normal font-mono">
                    View complete verified DMV title & service history document
                  </span>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            {/* 4-Pillar CARFAX Verification Matrix */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">No Accidents Reported</div>
                  <div className="text-[11px] text-slate-400">Clean title & zero damage</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                <UserCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">{carfax.ownerCount}-Owner Vehicle</div>
                  <div className="text-[11px] text-slate-400">Personal use confirmed</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                <Wrench className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">{carfax.serviceRecordCount} Service Records</div>
                  <div className="text-[11px] text-slate-400">Documented oil & diff care</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-200">{formatMiles(carfax.lastOdometerReading)}</div>
                  <div className="text-[11px] text-slate-400">{carfax.odometerStatus}</div>
                </div>
              </div>
            </div>

            {/* Buyback Guarantee Alert */}
            <div className="bg-blue-950/40 border border-blue-800/60 rounded-xl p-3.5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="font-bold text-blue-200 text-xs">
                  CARFAX Buyback Guarantee™ Included
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  Guarantees protection against severe damage, odometer fraud, or lemon law buyback. Eligible for up to 100% vehicle value reimbursement.
                </p>
              </div>
            </div>

            {/* Ownership Breakdown */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                  Ownership History
                </span>
                <span className="font-mono text-slate-400 text-[11px]">1 Verified Owner</span>
              </div>

              {carfax.owners.map((owner) => (
                <div key={owner.ownerIndex} className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Purchased in:</span>
                    <span className="font-mono text-white">{owner.yearPurchased} ({owner.location})</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Type of Use:</span>
                    <span className="text-white font-medium">{owner.typeOfUse}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Ownership Length:</span>
                    <span className="text-white font-mono">{owner.lengthOwnedYears} Years</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Avg. Annual Mileage:</span>
                    <span className="text-white font-mono">{formatNumber(owner.estimatedMilesPerYear)} mi/yr (Low)</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Service & Maintenance History Log */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-800/80 pb-2">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  Verified Maintenance Records ({carfax.serviceRecordCount})
                </span>
                <span className="text-emerald-400 text-[11px] font-mono">Up-to-Date</span>
              </div>

              <div className="space-y-3">
                {carfax.serviceHistory.map((rec, i) => (
                  <div key={i} className="relative pl-4 border-l-2 border-slate-800 text-xs space-y-1">
                    <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500" />
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-slate-300 font-semibold">{rec.date}</span>
                      <span className="font-mono text-amber-400">{formatMiles(rec.mileage)}</span>
                    </div>
                    <div className="font-medium text-slate-200 text-xs">
                      {rec.serviceProvider} <span className="text-slate-500 text-[10px]">· {rec.cityState}</span>
                    </div>
                    <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-0.5 pt-0.5">
                      {rec.servicesPerformed.map((detail, idx) => (
                        <li key={idx} className="leading-snug">{detail}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety Recalls Check */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300 font-medium">NHTSA Open Safety Recalls:</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">
                0 Open Recalls
              </span>
            </div>
          </div>
        )}

        {/* ================= TAB 2: BRAND NEW VS THIS USED CAR ================= */}
        {activeTab === 'new-vs-used' && (
          <div className="space-y-4">
            {/* Caution/Verdict Alert Banner */}
            <div className={`p-4 rounded-xl border ${
              brandNewComparison.verdict === 'Almost Same Price (Caution)'
                ? 'bg-rose-950/40 border-rose-600/60 text-rose-200'
                : 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
            }`}>
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className={`w-4 h-4 ${
                  brandNewComparison.verdict === 'Almost Same Price (Caution)' ? 'text-rose-400' : 'text-emerald-400'
                }`} />
                <span className="font-extrabold text-xs uppercase tracking-wider">
                  {brandNewComparison.verdict}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-200">
                {brandNewComparison.verdictReason}
              </p>
            </div>

            {/* Price Side-by-Side Comparison */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="text-xs font-bold text-white border-b border-slate-800 pb-2 flex items-center justify-between">
                <span>Side-by-Side Financial Comparison</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  Gap: {formatCurrency(brandNewComparison.priceDelta)} ({brandNewComparison.percentDifference.toFixed(1)}%)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Brand New Spec */}
                <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg space-y-2">
                  <div className="text-[10px] uppercase font-bold text-blue-400 font-mono">
                    BRAND NEW {brandNewComparison.brandNewYear}
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    {formatCurrency(brandNewComparison.brandNewConfiguredMSRP)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Sticker / Configured MSRP
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Promo APR:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {brandNewComparison.newFinanceRateAPR}% APR
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Est. Payment:</span>
                      <span className="font-mono font-bold text-white">
                        {formatCurrency(brandNewComparison.estimatedNewMonthlyPayment)}/mo
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Odometer:</span>
                      <span className="font-mono text-emerald-400">0 miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Warranty:</span>
                      <span className="text-slate-300">
                        {brandNewComparison.warrantyComparison.newWarrantyMonths} mo / {formatNumber(brandNewComparison.warrantyComparison.newWarrantyMiles)} mi
                      </span>
                    </div>
                  </div>
                </div>

                {/* This Used Spec */}
                <div className="bg-slate-900/90 border border-amber-500/40 p-3 rounded-lg space-y-2">
                  <div className="text-[10px] uppercase font-bold text-amber-400 font-mono">
                    THIS {car.year} USED
                  </div>
                  <div className="text-lg font-black text-amber-400 font-mono">
                    {formatCurrency(pricing.dealerPrice)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Dealership Asking Price
                  </div>

                  <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Used APR:</span>
                      <span className="font-mono font-bold text-slate-300">
                        {brandNewComparison.usedFinanceRateAPR}% APR
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Est. Payment:</span>
                      <span className="font-mono font-bold text-white">
                        {formatCurrency(brandNewComparison.estimatedUsedMonthlyPayment)}/mo
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Odometer:</span>
                      <span className="font-mono text-white">{formatMiles(car.mileage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Remaining:</span>
                      <span className="text-slate-300">
                        {brandNewComparison.warrantyComparison.remainingWarrantyMonths} mo / {formatNumber(brandNewComparison.warrantyComparison.remainingWarrantyMiles)} mi
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Payment Difference Callout */}
              <div className="bg-slate-900 p-3 rounded-lg text-xs font-mono flex items-center justify-between border border-slate-800">
                <span className="text-slate-400">Monthly Payment Spread:</span>
                <span className={`font-bold ${
                  brandNewComparison.estimatedNewMonthlyPayment <= brandNewComparison.estimatedUsedMonthlyPayment
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}>
                  {brandNewComparison.estimatedNewMonthlyPayment <= brandNewComparison.estimatedUsedMonthlyPayment ? (
                    `New is ${formatCurrency(brandNewComparison.estimatedUsedMonthlyPayment - brandNewComparison.estimatedNewMonthlyPayment)}/mo CHEAPER than used!`
                  ) : (
                    `Used saves ${formatCurrency(brandNewComparison.estimatedNewMonthlyPayment - brandNewComparison.estimatedUsedMonthlyPayment)}/mo`
                  )}
                </span>
              </div>
            </div>

            {/* Why Used is Nearly Same Price as Brand New analysis box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                Customer Negotiation Advantage
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Dealers frequently price late-model used cars within striking distance of new MSRP due to instant availability. Use the brand new MSRP of {formatCurrency(brandNewComparison.brandNewConfiguredMSRP)} as heavy leverage to negotiate this used vehicle down!
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 3: MMR & WHOLESALE TRADE VALUATION ================= */}
        {activeTab === 'mmr' && (
          <div className="space-y-4">
            {/* MMR Header Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">
                    MANHEIM MARKET REPORT (MMR)
                  </span>
                  <span className="text-xl font-black text-white font-mono">
                    {formatCurrency(mmr.wholesaleAverage)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">
                    AUTOGRADE
                  </span>
                  <span className="text-base font-bold text-amber-400 font-mono">
                    {mmr.autoGrade} / 5.0
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Auction Range</div>
                  <div className="font-bold text-white text-xs mt-0.5">
                    {formatCurrency(mmr.estimatedAuctionRange[0])} - {formatCurrency(mmr.estimatedAuctionRange[1])}
                  </div>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Dealer Markup Spread</div>
                  <div className="font-bold text-emerald-400 text-xs mt-0.5">
                    +{formatCurrency(mmr.wholesaleToRetailMargin)}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed">
                Wholesale volume: <span className="text-white font-mono">{mmr.wholesaleVolume30Days} units</span> auctioned in the past 30 days nationwide. Historical price index trend: <span className="text-amber-400 font-mono">{mmr.historicalTrendPercent}%</span>.
              </div>
            </div>

            {/* Instant Trade-In Valuation Grid */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                <span className="font-bold text-white">Estimated Trade-In Value</span>
                <button
                  onClick={() => onOpenTradeModal(car)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] flex items-center gap-1"
                >
                  <span>Run Custom Trade</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-emerald-300 font-sans">Clean Condition:</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(car.tradeInValue.clean)}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-300 font-sans">Average Condition:</span>
                  <span className="font-bold text-slate-200">{formatCurrency(car.tradeInValue.average)}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 font-sans">Rough / Wholesale Base:</span>
                  <span className="font-bold text-slate-400">{formatCurrency(car.tradeInValue.rough)}</span>
                </div>
              </div>
            </div>

            {/* Surrounding Area Comps Shortcut */}
            <button
              onClick={() => onOpenCompsModal(car)}
              className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span className="font-semibold text-slate-200">
                  Compare {car.surroundingComps.length} Surrounding Area Comps
                </span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= TAB 4: US DEALERSHIP DIRECTORY ================= */}
        {activeTab === 'dealers' && (
          <div className="space-y-4">
            <DealershipDirectorySideDock
              onSelectDealer={(dealer) => {
                if (onSelectDealer) onSelectDealer(dealer);
              }}
              onFilterByBrand={(brand) => {
                if (onFilterByBrand) onFilterByBrand(brand);
              }}
              activeDealerId={car.dealership.name}
              activeBrand={car.make}
            />
          </div>
        )}
      </div>

      {/* Footer Contact & Hold Car Action */}
      <div className="bg-slate-950 p-4 border-t border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-slate-200 font-medium truncate">{car.dealership.name}</span>
          </div>
          <span className="font-mono text-amber-400 shrink-0">{car.dealership.phone}</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenTradeModal(car)}
            className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs transition-colors text-center"
          >
            Calculate Trade Equity
          </button>
          <a
            href={car.dealership.website}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors text-center flex items-center justify-center gap-1"
          >
            <span>Contact Dealer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Transporters & Delivery Button (For Individuals & Dealers) */}
        <button
          onClick={() => onOpenTransportModal?.(car)}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/15 border border-amber-400/40 cursor-pointer"
          title="Vehicle transport and delivery for individuals buying out-of-state or dealer lot-to-lot transport"
        >
          <Truck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>Vehicle Transporters & Delivery (Individual / Dealer)</span>
        </button>
      </div>
    </div>
  );
};
