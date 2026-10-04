import React from 'react';
import { Car } from '../types/car';
import { formatCurrency, formatMiles } from '../utils/formatters';
import { 
  Zap, 
  Gauge, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  AlertTriangle,
  Building2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface ComparisonMatrixProps {
  cars: Car[];
  selectedCarForSideCarfax: Car | null;
  onSelectForCarfax: (car: Car) => void;
  onOpenCarfaxReport: (car: Car) => void;
  onOpenCompsModal: (car: Car) => void;
  onOpenDetailModal: (car: Car) => void;
  onOpenTradeModal: (car: Car) => void;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  cars,
  selectedCarForSideCarfax,
  onSelectForCarfax,
  onOpenCarfaxReport,
  onOpenCompsModal,
  onOpenDetailModal,
  onOpenTradeModal,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">
            Vehicle Side-by-Side Market Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Compare Drivetrain, Exact Color, HP/Torque, Surrounding Comps, Brand New MSRP, and CARFAX
          </p>
        </div>
        <span className="text-xs font-mono text-amber-400">
          {cars.length} Vehicles in Compare View
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
              <th className="py-3 px-4 sticky left-0 bg-slate-950 z-10">Vehicle / Dealer</th>
              <th className="py-3 px-4">Drivetrain</th>
              <th className="py-3 px-4">HP & Torque</th>
              <th className="py-3 px-4">Exact Color</th>
              <th className="py-3 px-4">Dealer Price</th>
              <th className="py-3 px-4">Brand New Delta</th>
              <th className="py-3 px-4">Surrounding Comps</th>
              <th className="py-3 px-4">MMR Wholesale</th>
              <th className="py-3 px-4">CARFAX Status</th>
              <th className="py-3 px-4 text-right">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {cars.map((car) => {
              const isSelected = selectedCarForSideCarfax?.id === car.id;
              const avgCompPrice = Math.round(
                car.surroundingComps.reduce((acc, c) => acc + c.price, 0) / (car.surroundingComps.length || 1)
              );
              const compDiff = avgCompPrice - car.pricing.dealerPrice;

              return (
                <tr 
                  key={car.id} 
                  className={`hover:bg-slate-850/60 transition-colors ${
                    isSelected ? 'bg-blue-950/20' : ''
                  }`}
                >
                  {/* Vehicle & Dealership */}
                  <td className="py-3 px-4 sticky left-0 bg-slate-900 z-10 min-w-[200px]">
                    <div className="font-bold text-white text-sm">
                      {car.year} {car.make} {car.model}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {car.trim} · {formatMiles(car.mileage)}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-amber-400/90 mt-0.5">
                      <Building2 className="w-3 h-3 shrink-0" />
                      <span className="truncate">{car.dealership.name} ({car.dealership.distanceMiles} mi)</span>
                    </div>
                  </td>

                  {/* Drivetrain */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-slate-950 border border-slate-700 font-mono font-bold text-white rounded">
                      {car.drivetrain}
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-0.5">0-60 in {car.zeroToSixty}s</span>
                  </td>

                  {/* HP & Torque */}
                  <td className="py-3 px-4 font-mono whitespace-nowrap">
                    <div className="text-white font-bold">
                      {car.horsepower} <span className="text-slate-400 font-normal text-[10px]">hp</span>
                    </div>
                    <div className="text-orange-400">
                      {car.torque} <span className="text-slate-400 font-normal text-[10px]">lb-ft</span>
                    </div>
                  </td>

                  {/* Exact Color */}
                  <td className="py-3 px-4 min-w-[170px]">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0"
                        style={{ backgroundColor: car.exactColor.exteriorHex }}
                      />
                      <span className="font-semibold text-slate-200 text-xs truncate">
                        {car.exactColor.exteriorName}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate pl-5">
                      Code: {car.exactColor.exteriorCode} · {car.exactColor.finish}
                    </div>
                  </td>

                  {/* Dealer Price */}
                  <td className="py-3 px-4 font-mono whitespace-nowrap">
                    <div className="text-base font-black text-white">
                      {formatCurrency(car.pricing.dealerPrice)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      MSRP: {formatCurrency(car.pricing.msrp)}
                    </div>
                  </td>

                  {/* Brand New Delta */}
                  <td className="py-3 px-4 min-w-[160px]">
                    <div className="font-mono text-xs font-bold text-white">
                      New: {formatCurrency(car.brandNewComparison.brandNewConfiguredMSRP)}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      Gap: {formatCurrency(car.brandNewComparison.priceDelta)} ({car.brandNewComparison.percentDifference.toFixed(1)}%)
                    </div>
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                      car.brandNewComparison.verdict === 'Almost Same Price (Caution)'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {car.brandNewComparison.verdict}
                    </span>
                  </td>

                  {/* Surrounding Comps */}
                  <td className="py-3 px-4 min-w-[150px]">
                    <button
                      onClick={() => onOpenCompsModal(car)}
                      className="text-left group"
                    >
                      <div className="font-mono text-xs text-blue-400 font-semibold group-hover:underline flex items-center gap-1">
                        <span>{car.surroundingComps.length} Local Comps</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Avg: {formatCurrency(avgCompPrice)}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400">
                        {compDiff > 0 ? `-${formatCurrency(compDiff)} vs avg` : `+${formatCurrency(Math.abs(compDiff))} vs avg`}
                      </div>
                    </button>
                  </td>

                  {/* MMR Wholesale */}
                  <td className="py-3 px-4 font-mono whitespace-nowrap">
                    <div className="text-slate-200 font-bold">
                      {formatCurrency(car.mmr.wholesaleAverage)}
                    </div>
                    <div className="text-[10px] text-amber-400">
                      Grade {car.mmr.autoGrade}/5.0
                    </div>
                  </td>

                  {/* CARFAX */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      onClick={() => onOpenCarfaxReport(car)}
                      className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold group cursor-pointer"
                      title="Click to show the CARFAX report"
                    >
                      <ShieldCheck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span className="underline decoration-blue-500/40 underline-offset-2">
                        {car.carfax.accidentCount === 0 ? 'No Accidents' : `${car.carfax.accidentCount} Acc.`}
                      </span>
                    </button>
                    <button
                      onClick={() => onOpenCarfaxReport(car)}
                      className="block text-[10px] text-slate-400 hover:text-white font-mono mt-0.5 text-left"
                    >
                      {car.carfax.ownerCount}-Owner · {car.carfax.serviceRecordCount} Services (Click to view)
                    </button>
                  </td>

                  {/* Quick Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenCarfaxReport(car)}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
                        title="Show the Fax"
                      >
                        Show Fax
                      </button>
                      <button
                        onClick={() => onSelectForCarfax(car)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-slate-800 text-amber-400 border-amber-500/50'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                        }`}
                        title="Show CARFAX on Side Dock"
                      >
                        Side Dock
                      </button>
                      <button
                        onClick={() => onOpenDetailModal(car)}
                        className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition-colors"
                      >
                        Specs
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
