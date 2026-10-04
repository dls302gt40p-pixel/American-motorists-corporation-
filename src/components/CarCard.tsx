import React from 'react';
import { Car } from '../types/car';
import { formatCurrency, formatMiles, formatNumber } from '../utils/formatters';
import { 
  Gauge, 
  Zap, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  ChevronRight, 
  Clock, 
  Scale, 
  CheckCircle2, 
  Building2,
  Phone,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface CarCardProps {
  car: Car;
  isSelectedForCarfax: boolean;
  onSelectForCarfax: (car: Car) => void;
  onOpenCarfaxReport: (car: Car) => void;
  onOpenCompsModal: (car: Car) => void;
  onOpenDetailModal: (car: Car) => void;
  onOpenTradeModal: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({
  car,
  isSelectedForCarfax,
  onSelectForCarfax,
  onOpenCarfaxReport,
  onOpenCompsModal,
  onOpenDetailModal,
  onOpenTradeModal,
}) => {
  const {
    year,
    make,
    model,
    trim,
    mileage,
    drivetrain,
    engine,
    horsepower,
    torque,
    zeroToSixty,
    exactColor,
    dealership,
    pricing,
    surroundingComps,
    mmr,
    tradeInValue,
    carfax,
    imageUrl,
  } = car;

  // Calculate surrounding area stats
  const compsCount = surroundingComps.length;
  const avgCompPrice = Math.round(
    surroundingComps.reduce((acc, c) => acc + c.price, 0) / (compsCount || 1)
  );
  const priceDifferenceToAvg = avgCompPrice - pricing.dealerPrice;

  return (
    <div 
      className={`group relative bg-slate-900 border rounded-xl overflow-hidden transition-all duration-200 flex flex-col ${
        isSelectedForCarfax 
          ? 'border-blue-500 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500' 
          : 'border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-black/40'
      }`}
    >
      {/* Top Banner: Dealership & Distance */}
      <div className="bg-slate-950/80 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-semibold text-slate-200 truncate">{dealership.name}</span>
          <span className="text-slate-500 shrink-0">·</span>
          <span className="text-slate-400 shrink-0">{dealership.city}, {dealership.state}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 shrink-0 font-mono text-[11px] ml-2">
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>{dealership.distanceMiles} mi away</span>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        {/* Title, Trim, and Year */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <span>{year} {make}</span>
                <span className="text-slate-600">|</span>
                <span>{formatMiles(mileage)}</span>
                <span className="text-slate-600">|</span>
                <span className="text-slate-500">VIN: ...{car.vin.slice(-6)}</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors">
                {make} {model}
              </h3>
              <p className="text-xs text-slate-400 font-medium">{trim}</p>
            </div>

            {/* Price block */}
            <div className="text-right shrink-0">
              <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">
                {formatCurrency(pricing.dealerPrice)}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                MSRP: <span className="line-through">{formatCurrency(pricing.msrp)}</span>
              </div>
              {pricing.discountOrMarkup < 0 && (
                <div className="text-[10px] font-semibold text-emerald-400 font-mono">
                  Save {formatCurrency(Math.abs(pricing.discountOrMarkup))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle Image & Exact Color Overlay */}
        <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
          <img
            src={imageUrl}
            alt={`${year} ${make} ${model} in ${exactColor.exteriorName}`}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

          {/* Drivetrain Badge on top left of image */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 px-2.5 py-1 rounded text-xs font-mono font-bold text-white shadow-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{drivetrain}</span>
            <span className="text-slate-500 text-[10px]">DRIVETRAIN</span>
          </div>

          {/* 0-60 Time Badge on top right of image */}
          <div className="absolute top-2.5 right-2.5 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 px-2 py-1 rounded text-[11px] font-mono font-semibold text-slate-200">
            0-60: <span className="text-amber-400 font-bold">{zeroToSixty}s</span>
          </div>

          {/* Exact Color Badge at bottom of image */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between bg-slate-950/95 backdrop-blur-md border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div 
                className="w-4 h-4 rounded-full border border-white/30 shrink-0 shadow-inner"
                style={{ backgroundColor: exactColor.exteriorHex }}
                title={`Paint Code: ${exactColor.exteriorCode}`}
              />
              <div className="truncate">
                <span className="font-semibold text-slate-100 truncate block text-[11px] sm:text-xs">
                  {exactColor.exteriorName}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  Code {exactColor.exteriorCode} · {exactColor.finish}
                </span>
              </div>
            </div>
            <div className="text-right shrink-0 ml-2 hidden sm:block">
              <span className="text-[10px] text-slate-400 block">Interior:</span>
              <span className="text-[10px] font-medium text-amber-200/90 block truncate max-w-[130px]">
                {exactColor.interiorName}
              </span>
            </div>
          </div>
        </div>

        {/* Engine, HP & Torque Power Bar */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-center">
          <div className="border-r border-slate-800 pr-2">
            <div className="flex items-center justify-center gap-1 text-[11px] text-amber-400 font-bold tracking-wider uppercase mb-0.5">
              <Zap className="w-3.5 h-3.5" />
              <span>HORSEPOWER</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {horsepower} <span className="text-xs font-normal text-slate-400">hp</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {engine.split('(')[0]}
            </div>
          </div>

          <div className="pl-2">
            <div className="flex items-center justify-center gap-1 text-[11px] text-orange-400 font-bold tracking-wider uppercase mb-0.5">
              <Gauge className="w-3.5 h-3.5" />
              <span>TORQUE</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">
              {torque} <span className="text-xs font-normal text-slate-400">lb-ft</span>
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              Peak Power Band
            </div>
          </div>
        </div>

        {/* Surrounding Areas Price Comparison Preview Box */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Surrounding Area Market ({compsCount} Comps)
            </span>
            <button
              onClick={() => onOpenCompsModal(car)}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5 hover:underline"
            >
              <span>View All Comps</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-slate-400">
              Regional Avg: <span className="text-slate-200">{formatCurrency(avgCompPrice)}</span>
            </span>
            {priceDifferenceToAvg > 0 ? (
              <span className="text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-500/30 px-1.5 py-0.5 rounded text-[10px]">
                {formatCurrency(priceDifferenceToAvg)} Below Surrounding Avg
              </span>
            ) : (
              <span className="text-amber-400 font-semibold bg-amber-950/50 border border-amber-500/30 px-1.5 py-0.5 rounded text-[10px]">
                {formatCurrency(Math.abs(priceDifferenceToAvg))} Above Surrounding Avg
              </span>
            )}
          </div>
        </div>

        {/* MMR & Trade-In Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* MMR Wholesale Rating */}
          <div className="bg-slate-950 border border-slate-800/80 p-2 rounded-lg">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span className="font-bold text-slate-300">MMR RATING</span>
              <span className="text-amber-400 font-mono font-bold">Grade {mmr.autoGrade}/5.0</span>
            </div>
            <div className="font-mono text-sm font-bold text-slate-100">
              {formatCurrency(mmr.wholesaleAverage)}
            </div>
            <div className="text-[10px] text-slate-500">
              Wholesale spread: {formatCurrency(mmr.wholesaleToRetailMargin)}
            </div>
          </div>

          {/* Trade-in Value */}
          <div className="bg-slate-950 border border-slate-800/80 p-2 rounded-lg">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span className="font-bold text-slate-300">EST. TRADE VALUE</span>
              <button 
                onClick={() => onOpenTradeModal(car)}
                className="text-[10px] text-emerald-400 hover:underline"
              >
                Appraise
              </button>
            </div>
            <div className="font-mono text-sm font-bold text-emerald-400">
              {formatCurrency(tradeInValue.recommendedInstantOffer)}
            </div>
            <div className="text-[10px] text-slate-500">
              Clean Trade: {formatCurrency(tradeInValue.clean)}
            </div>
          </div>
        </div>

        {/* CARFAX Status Strip & Action Buttons */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
          {/* Clickable Carfax summary strip */}
          <button
            onClick={() => onOpenCarfaxReport(car)}
            className="w-full text-left flex items-center justify-between bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 hover:border-blue-500 rounded-lg px-3 py-2 text-[11px] group/carfax transition-all cursor-pointer shadow-sm hover:shadow-blue-500/10"
            title="Click to show the full official CARFAX report"
          >
            <div className="flex items-center gap-1.5 text-blue-300">
              <ShieldCheck className="w-4 h-4 text-blue-400 group-hover/carfax:scale-110 transition-transform" />
              <span className="font-bold text-white">CARFAX:</span>
              <span className="text-slate-300">
                {carfax.accidentCount === 0 ? 'No Accidents' : `${carfax.accidentCount} Accident`} · {carfax.ownerCount}-Owner
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-blue-400 group-hover/carfax:text-blue-300 text-[10px]">
              <span>Click to Show Fax</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover/carfax:translate-x-0.5 group-hover/carfax:-translate-y-0.5 transition-transform" />
            </div>
          </button>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            <button
              onClick={() => onOpenCarfaxReport(car)}
              className="flex items-center justify-center gap-1 py-2 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
              title="Click to show the official CARFAX report"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Show Fax</span>
            </button>

            <button
              onClick={() => onSelectForCarfax(car)}
              className={`flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all border ${
                isSelectedForCarfax
                  ? 'bg-slate-800 text-amber-400 border-amber-500/50'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
              title="Dock to side panel"
            >
              <span>{isSelectedForCarfax ? 'Active on Side' : 'Side Dock'}</span>
            </button>

            <button
              onClick={() => onOpenDetailModal(car)}
              className="flex items-center justify-center gap-1 py-2 px-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
              title="Full Vehicle Specifications"
            >
              <span>Full Specs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
