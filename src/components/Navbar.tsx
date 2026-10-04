import React from 'react';
import { 
  Car as CarIcon, 
  MapPin, 
  ShieldCheck, 
  TrendingUp, 
  Calculator, 
  Search, 
  SlidersHorizontal,
  ChevronDown,
  Building2,
  Plus
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
  activeView: 'grid' | 'split' | 'matrix' | 'dealers';
  onViewChange: (view: 'grid' | 'split' | 'matrix' | 'dealers') => void;
  onOpenTradeModal: () => void;
  onOpenVinModal: () => void;
  onOpenDirectory: () => void;
  onOpenAddCarModal: () => void;
  isSideCarfaxOpen: boolean;
  onToggleSideCarfax: () => void;
  totalCarsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedRadius,
  onRadiusChange,
  activeView,
  onViewChange,
  onOpenTradeModal,
  onOpenVinModal,
  onOpenDirectory,
  onOpenAddCarModal,
  isSideCarfaxOpen,
  onToggleSideCarfax,
  totalCarsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand with American Flag on Blacktop Road Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-amber-500/40 shadow-lg shadow-amber-500/20 bg-slate-900 shrink-0 group">
              <img
                src="/src/assets/images/flag_road_emblem_1791141801436.jpg"
                alt="A.M.C American Flag on Blacktop Road Emblem"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-xl" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-lg text-white font-mono flex items-center gap-1.5">
                  A.M.C <span className="text-amber-400 text-sm hidden sm:inline font-sans font-bold">AMERICAN MOTORISTS CORPORATION</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">
                  OFFICIAL
                </span>
              </div>
              <p className="text-xs text-slate-400 block sm:hidden font-semibold text-amber-400">
                AMERICAN MOTORISTS CORPORATION
              </p>
              <p className="text-xs text-slate-400 hidden sm:block">
                Dealership Intelligence · Exact Colors · Drivetrain & Specs · Comps · CARFAX & MMR
              </p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search make, model, exact color (e.g. Nardo, Chalk, M3)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Location & Radius selector */}
          <div className="flex items-center gap-2">
            <div className="relative group hidden lg:flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium text-white">Los Angeles, CA</span>
              <span className="text-slate-500">·</span>
              <select
                value={selectedRadius}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                aria-label="Search radius in miles"
                className="bg-transparent text-amber-400 font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value={15} className="bg-slate-900 text-slate-200">Within 15 mi</option>
                <option value={25} className="bg-slate-900 text-slate-200">Within 25 mi</option>
                <option value={50} className="bg-slate-900 text-slate-200">Within 50 mi</option>
                <option value={100} className="bg-slate-900 text-slate-200">Within 100 mi</option>
                <option value={250} className="bg-slate-900 text-slate-200">Within 250 mi</option>
              </select>
            </div>

            {/* + Add Vehicle Button */}
            <button
              onClick={onOpenAddCarModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:to-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-lg text-xs shadow-md shadow-emerald-500/20 border border-emerald-400/50 transition-all cursor-pointer"
              title="Add a new car and upload pictures to inventory"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Add Vehicle</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Quick Tools */}
            <button
              onClick={onOpenTradeModal}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              title="Calculate Trade-In Equity Appraisal"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Trade Appraisal</span>
              <span className="sm:hidden">Trade</span>
            </button>

            {/* US Dealership Directory Quick Button */}
            <button
              onClick={onOpenDirectory}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                activeView === 'dealers'
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-amber-400 hover:text-amber-300'
              }`}
              title="Browse all dealerships in the US A-Z & by brand"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">US Dealerships (A–Z & Brands)</span>
              <span className="sm:hidden">Dealers A–Z</span>
            </button>

            {/* CARFAX Side Panel Toggle Button */}
            <button
              onClick={onToggleSideCarfax}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                isSideCarfaxOpen
                  ? 'bg-blue-600 border-blue-500 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isSideCarfaxOpen ? 'text-white' : 'text-blue-400'}`} />
              <span>CARFAX Dock</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
