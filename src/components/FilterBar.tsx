import React from 'react';
import { FilterState } from '../types/car';
import { 
  Zap, 
  Gauge, 
  Palette, 
  ArrowUpDown, 
  ShieldCheck, 
  Check, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFiltered: number;
}

const COLOR_SWATCHES = [
  { name: 'All Colors', colorHex: 'transparent', key: 'all' },
  { name: 'Green', colorHex: '#144634', key: 'green' },
  { name: 'Blue', colorHex: '#0072CE', key: 'blue' },
  { name: 'Gray/Chalk', colorHex: '#6F7278', key: 'gray' },
  { name: 'Red', colorHex: '#B21C1C', key: 'red' },
  { name: 'Black/Dark', colorHex: '#1E1E1E', key: 'black' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFiltered,
}) => {
  const DRIVETRAINS = ['ALL', 'AWD', 'RWD', '4WD'];

  return (
    <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Top Filter Row: Drivetrain Buttons, HP/Torque Range quick tags, and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Drivetrain Segmented Control */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase tracking-wider">
              Drivetrain:
            </span>
            {DRIVETRAINS.map((dt) => {
              const active = (dt === 'ALL' && filters.drivetrain === 'all') || filters.drivetrain === dt;
              return (
                <button
                  key={dt}
                  onClick={() => onFilterChange({ drivetrain: dt === 'ALL' ? 'all' : dt })}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {dt}
                </button>
              );
            })}
          </div>

          {/* Horsepower & Torque Quick Thresholds */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Min HP:</span>
              <select
                value={filters.minHp}
                onChange={(e) => onFilterChange({ minHp: Number(e.target.value) })}
                aria-label="Minimum horsepower"
                className="bg-transparent text-amber-300 font-mono font-medium focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-slate-900 text-white">Any HP</option>
                <option value={400} className="bg-slate-900 text-white">400+ HP</option>
                <option value={500} className="bg-slate-900 text-white">500+ HP</option>
                <option value={600} className="bg-slate-900 text-white">600+ HP</option>
                <option value={700} className="bg-slate-900 text-white">700+ HP</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <Gauge className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-slate-400">Min Torque:</span>
              <select
                value={filters.minTorque}
                onChange={(e) => onFilterChange({ minTorque: Number(e.target.value) })}
                aria-label="Minimum torque in pound-feet"
                className="bg-transparent text-orange-300 font-mono font-medium focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-slate-900 text-white">Any Torque</option>
                <option value={400} className="bg-slate-900 text-white">400+ lb-ft</option>
                <option value={450} className="bg-slate-900 text-white">450+ lb-ft</option>
                <option value={600} className="bg-slate-900 text-white">600+ lb-ft</option>
                <option value={700} className="bg-slate-900 text-white">700+ lb-ft</option>
              </select>
            </div>
          </div>

          {/* CARFAX 1-Owner and Clean Badges filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onFilterChange({ onlyCleanCarfax: !filters.onlyCleanCarfax })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                filters.onlyCleanCarfax
                  ? 'bg-blue-950/80 border-blue-500/60 text-blue-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Clean CARFAX</span>
              {filters.onlyCleanCarfax && <Check className="w-3 h-3 text-blue-400 ml-0.5" />}
            </button>

            <button
              onClick={() => onFilterChange({ onlyOneOwner: !filters.onlyOneOwner })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                filters.onlyOneOwner
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>1-Owner Only</span>
              {filters.onlyOneOwner && <Check className="w-3 h-3 text-emerald-400 ml-0.5" />}
            </button>
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
                aria-label="Sort vehicle inventory"
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="price-asc" className="bg-slate-900 text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-slate-900 text-white">Price: High to Low</option>
                <option value="hp-desc" className="bg-slate-900 text-white">Horsepower: Highest First</option>
                <option value="torque-desc" className="bg-slate-900 text-white">Torque: Highest First</option>
                <option value="distance-asc" className="bg-slate-900 text-white">Closest Dealership</option>
                <option value="mmr-margin-desc" className="bg-slate-900 text-white">Best MMR Margin (Buyer Leverage)</option>
              </select>
            </div>

            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Second Row: Exact Color Swatches & Active Results Counter */}
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800/40 text-xs">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <span className="text-slate-400 font-medium flex items-center gap-1 shrink-0">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              Exact Paint Family:
            </span>
            <div className="flex items-center gap-1.5">
              {COLOR_SWATCHES.map((swatch) => {
                const isSelected = filters.colorFamily === swatch.key;
                return (
                  <button
                    key={swatch.key}
                    onClick={() => onFilterChange({ colorFamily: swatch.key })}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-amber-500 text-white shadow-sm ring-1 ring-amber-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {swatch.key !== 'all' ? (
                      <span
                        className="w-3 h-3 rounded-full border border-slate-600 shadow-sm shrink-0"
                        style={{ backgroundColor: swatch.colorHex }}
                      />
                    ) : null}
                    <span>{swatch.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-slate-400 font-mono text-xs shrink-0">
            Showing <span className="text-amber-400 font-bold">{totalFiltered}</span> dealer vehicles
          </div>
        </div>
      </div>
    </div>
  );
};
