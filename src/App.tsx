import React, { useState, useMemo } from 'react';
import { MOCK_CARS } from './data/mockCars';
import { Car, FilterState } from './types/car';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { CarCard } from './components/CarCard';
import { CarfaxSidePanel } from './components/CarfaxSidePanel';
import { SurroundingCompsModal } from './components/SurroundingCompsModal';
import { TradeInCalculatorModal } from './components/TradeInCalculatorModal';
import { CarDetailModal } from './components/CarDetailModal';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { CarfaxReportModal } from './components/CarfaxReportModal';
import { DealershipDirectorySideDock } from './components/DealershipDirectorySideDock';
import { TransportDeliveryModal } from './components/TransportDeliveryModal';
import { AddCarModal } from './components/AddCarModal';
import { USDealership } from './data/usDealerships';
import { 
  ShieldCheck, 
  AlertTriangle, 
  LayoutGrid, 
  TableProperties, 
  Layers, 
  Zap, 
  Calculator, 
  Sparkles,
  Info,
  Building2,
  X,
  Truck,
  RotateCcw
} from 'lucide-react';
import { formatCurrency } from './utils/formatters';

export default function App() {
  const [cars, setCars] = useState<Car[]>(() => {
    try {
      const saved = localStorage.getItem('amc_custom_inventory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading custom cars:', e);
    }
    return MOCK_CARS;
  });

  // Search & Radius
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRadius, setSelectedRadius] = useState<number>(50);
  const [selectedDealerFilter, setSelectedDealerFilter] = useState<USDealership | null>(null);

  // Layout View mode
  const [viewMode, setViewMode] = useState<'grid' | 'split' | 'matrix' | 'dealers'>('grid');
  const [rightPanelTab, setRightPanelTab] = useState<'both' | 'dealers' | 'carfax' | 'transport'>('both');

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    make: 'all',
    drivetrain: 'all',
    minHp: 0,
    maxHp: 1000,
    minTorque: 0,
    maxTorque: 1000,
    maxPrice: 300000,
    maxDistance: 100,
    colorFamily: 'all',
    onlyCleanCarfax: false,
    onlyOneOwner: false,
    sortBy: 'price-asc',
  });

  // Selected car docked into the CARFAX side panel (default to first vehicle)
  const [selectedCarForSideCarfax, setSelectedCarForSideCarfax] = useState<Car>(MOCK_CARS[0]);
  const [isSideCarfaxOpen, setIsSideCarfaxOpen] = useState<boolean>(true);

  // Modals state
  const [compsModalCar, setCompsModalCar] = useState<Car | null>(null);
  const [detailModalCar, setDetailModalCar] = useState<Car | null>(null);
  const [tradeModalCar, setTradeModalCar] = useState<Car | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState<boolean>(false);
  const [carfaxReportModalCar, setCarfaxReportModalCar] = useState<Car | null>(null);
  const [transportModalCar, setTransportModalCar] = useState<Car | null>(null);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState<boolean>(false);

  // Add custom car to inventory & save in localStorage
  const handleAddCar = (newCar: Car) => {
    setCars((prev) => {
      const updated = [newCar, ...prev];
      try {
        localStorage.setItem('amc_custom_inventory', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage limit exceeded, kept in session memory:', e);
      }
      return updated;
    });
    setSelectedCarForSideCarfax(newCar);
    setIsSideCarfaxOpen(true);
  };

  const handleResetInventory = () => {
    localStorage.removeItem('amc_custom_inventory');
    setCars(MOCK_CARS);
    setSelectedCarForSideCarfax(MOCK_CARS[0]);
  };

  // Quick filter toggle: Show only vehicles where used is almost same price as new
  const [filterOnlyCautionNewVsUsed, setFilterOnlyCautionNewVsUsed] = useState<boolean>(false);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDealerFilter(null);
    setFilterOnlyCautionNewVsUsed(false);
    setFilters({
      searchQuery: '',
      make: 'all',
      drivetrain: 'all',
      minHp: 0,
      maxHp: 1000,
      minTorque: 0,
      maxTorque: 1000,
      maxPrice: 300000,
      maxDistance: 100,
      colorFamily: 'all',
      onlyCleanCarfax: false,
      onlyOneOwner: false,
      sortBy: 'price-asc',
    });
  };

  const handleDealerSelect = (dealer: USDealership) => {
    setSelectedDealerFilter(dealer);
    
    // If dealer has an active car in our app database, dock it immediately to CARFAX!
    if (dealer.hasCurrentCarsInApp) {
      const match = cars.find(
        (c) => c.dealership.name.toLowerCase().includes(dealer.name.toLowerCase().slice(0, 10)) ||
               (dealer.carIdInApp && c.id === dealer.carIdInApp)
      );
      if (match) {
        setSelectedCarForSideCarfax(match);
      }
    } else {
      // Filter by brand so user sees matching vehicles
      setFilters((prev) => ({ ...prev, make: dealer.brand }));
    }
  };

  const handleBrandFilter = (brand: string) => {
    setSelectedDealerFilter(null);
    setFilters((prev) => ({ ...prev, make: brand === 'All Brands' ? 'all' : brand }));
  };

  // Filter and sort cars
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        // Active Dealer filter
        if (selectedDealerFilter) {
          const matchDealerName = car.dealership.name.toLowerCase().includes(selectedDealerFilter.name.toLowerCase().slice(0, 10));
          const matchBrand = car.make.toLowerCase().includes(selectedDealerFilter.brand.toLowerCase());
          if (!matchDealerName && !matchBrand) {
            return false;
          }
        }

        // Brand filter
        if (filters.make !== 'all') {
          if (!car.make.toLowerCase().includes(filters.make.toLowerCase())) {
            return false;
          }
        }

        // Search query
        const query = searchQuery.trim().toLowerCase();
        if (query) {
          const matchTitle = `${car.year} ${car.make} ${car.model} ${car.trim}`.toLowerCase().includes(query);
          const matchColor = car.exactColor.exteriorName.toLowerCase().includes(query);
          const matchDealer = car.dealership.name.toLowerCase().includes(query);
          const matchDrivetrain = car.drivetrain.toLowerCase().includes(query);
          const matchVin = car.vin.toLowerCase().includes(query);
          if (!matchTitle && !matchColor && !matchDealer && !matchDrivetrain && !matchVin) {
            return false;
          }
        }

        // Drivetrain
        if (filters.drivetrain !== 'all' && car.drivetrain !== filters.drivetrain) {
          return false;
        }

        // Min HP
        if (filters.minHp > 0 && car.horsepower < filters.minHp) {
          return false;
        }

        // Min Torque
        if (filters.minTorque > 0 && car.torque < filters.minTorque) {
          return false;
        }

        // Exact Color family
        if (filters.colorFamily !== 'all') {
          const cName = car.exactColor.exteriorName.toLowerCase();
          if (filters.colorFamily === 'green' && !cName.includes('green')) return false;
          if (filters.colorFamily === 'blue' && !cName.includes('blue')) return false;
          if (filters.colorFamily === 'gray' && !cName.includes('gray') && !cName.includes('chalk') && !cName.includes('magno')) return false;
          if (filters.colorFamily === 'red' && !cName.includes('red')) return false;
          if (filters.colorFamily === 'black' && !cName.includes('black') && !cName.includes('shadow')) return false;
        }

        // Clean CARFAX
        if (filters.onlyCleanCarfax && (car.carfax.accidentCount > 0 || !car.carfax.cleanTitle)) {
          return false;
        }

        // 1-Owner
        if (filters.onlyOneOwner && car.carfax.ownerCount > 1) {
          return false;
        }

        // New vs Used Caution filter
        if (filterOnlyCautionNewVsUsed && car.brandNewComparison.verdict !== 'Almost Same Price (Caution)') {
          return false;
        }

        // Radius distance
        if (car.dealership.distanceMiles > selectedRadius) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price-asc') return a.pricing.dealerPrice - b.pricing.dealerPrice;
        if (filters.sortBy === 'price-desc') return b.pricing.dealerPrice - a.pricing.dealerPrice;
        if (filters.sortBy === 'hp-desc') return b.horsepower - a.horsepower;
        if (filters.sortBy === 'torque-desc') return b.torque - a.torque;
        if (filters.sortBy === 'distance-asc') return a.dealership.distanceMiles - b.dealership.distanceMiles;
        if (filters.sortBy === 'mmr-margin-desc') return b.mmr.wholesaleToRetailMargin - a.mmr.wholesaleToRetailMargin;
        return 0;
      });
  }, [cars, searchQuery, selectedRadius, filters, filterOnlyCautionNewVsUsed]);

  // Count vehicles flagged as "Almost Same Price"
  const cautionCount = useMemo(() => {
    return cars.filter((c) => c.brandNewComparison.verdict === 'Almost Same Price (Caution)').length;
  }, [cars]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedRadius={selectedRadius}
        onRadiusChange={setSelectedRadius}
        activeView={viewMode}
        onViewChange={setViewMode}
        onOpenTradeModal={() => {
          setTradeModalCar(selectedCarForSideCarfax);
          setIsTradeModalOpen(true);
        }}
        onOpenVinModal={() => {
          setDetailModalCar(selectedCarForSideCarfax);
        }}
        onOpenAddCarModal={() => setIsAddCarModalOpen(true)}
        onOpenDirectory={() => {
          setIsSideCarfaxOpen(true);
          setRightPanelTab('dealers');
          const el = document.getElementById('us-dealership-directory');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            setViewMode('dealers');
          }
        }}
        isSideCarfaxOpen={isSideCarfaxOpen}
        onToggleSideCarfax={() => setIsSideCarfaxOpen((prev) => !prev)}
        totalCarsCount={cars.length}
      />

      {/* Filter Bar with Drivetrain, HP/Torque thresholds, Color Swatches, and Sort */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        totalFiltered={filteredCars.length}
      />

      {/* Brand New vs Used Caution Intelligence Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="p-1 rounded bg-amber-500/20 text-amber-400 font-mono font-bold text-[10px] uppercase border border-amber-500/30">
              MARKET ALERT
            </span>
            <span>
              <strong className="text-white font-semibold">New vs. Used Price Convergence:</strong> {cautionCount} cars in regional inventory are priced within $6,000 of a brand new model.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOnlyCautionNewVsUsed((prev) => !prev)}
              className={`px-3 py-1 rounded-md font-mono text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                filterOnlyCautionNewVsUsed
                  ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                  : 'bg-slate-950 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{filterOnlyCautionNewVsUsed ? 'Showing "Almost Same Price" Only' : `Show ${cautionCount} "Almost Same as New" Cars`}</span>
            </button>

            {/* View Mode Toggle Buttons */}
            <div className="flex items-center bg-slate-950 border border-slate-800 p-0.5 rounded-lg gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  viewMode === 'grid' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>
              <button
                onClick={() => setViewMode('matrix')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  viewMode === 'matrix' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Comparison Table Matrix"
              >
                <TableProperties className="w-3.5 h-3.5" />
                <span>Matrix</span>
              </button>
              <button
                onClick={() => setViewMode('dealers')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                  viewMode === 'dealers' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-amber-400 hover:text-amber-300'
                }`}
                title="Browse all dealerships in the US A-Z & by brand"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>US Dealers A–Z</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Responsive CARFAX Side-Dock and US Dealership Directory under it */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6 relative">
        {/* Main Listing View (Grid, Matrix, or US Dealers) */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Active Dealership Filter Banner */}
          {selectedDealerFilter && (
            <div className="bg-amber-950/40 border border-amber-500/50 rounded-xl p-3 flex items-center justify-between text-xs text-slate-200">
              <div className="flex items-center gap-2 truncate pr-2">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">
                  Active Dealer: <strong className="text-white font-bold">{selectedDealerFilter.name}</strong> ({selectedDealerFilter.city}, {selectedDealerFilter.state}) · Brand: <span className="text-amber-300 font-mono font-semibold">{selectedDealerFilter.brand}</span>
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={selectedDealerFilter.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold underline text-[11px]"
                >
                  Dealer Site ↗
                </a>
                <button
                  onClick={() => setSelectedDealerFilter(null)}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[10px] font-mono"
                >
                  Clear Dealer Filter
                </button>
              </div>
            </div>
          )}

          {/* Custom Inventory Status Bar */}
          {cars.length > MOCK_CARS.length && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-emerald-200">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom Inventory Active ({cars.length - MOCK_CARS.length} added by you) · Saved locally in your browser</span>
              </span>
              <button
                onClick={handleResetInventory}
                className="text-[11px] font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 underline transition-colors cursor-pointer"
                title="Reset to factory stock vehicles"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Factory Defaults</span>
              </button>
            </div>
          )}

          {viewMode === 'dealers' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <span>Nationwide US Dealership Network (A–Z & Brand Search)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Find dealerships in all 50 states A–Z or click brands to see where all their dealerships are located across America.
                  </p>
                </div>
                <button
                  onClick={() => setViewMode('grid')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
                >
                  ← Return to Car Cards
                </button>
              </div>

              <DealershipDirectorySideDock
                onSelectDealer={(dealer) => {
                  handleDealerSelect(dealer);
                  setViewMode('grid');
                }}
                onFilterByBrand={(brand) => {
                  handleBrandFilter(brand);
                  setViewMode('grid');
                }}
                onOpenTransportModal={() => setTransportModalCar(selectedCarForSideCarfax)}
                activeDealerId={selectedDealerFilter?.id}
                activeBrand={filters.make !== 'all' ? filters.make : undefined}
              />
            </div>
          ) : filteredCars.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">No vehicles found matching current criteria</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                Try widening your search radius, lowering minimum horsepower/torque thresholds, or resetting dealer/brand filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isSelectedForCarfax={selectedCarForSideCarfax?.id === car.id}
                  onSelectForCarfax={(selected) => {
                    setSelectedCarForSideCarfax(selected);
                    setIsSideCarfaxOpen(true);
                  }}
                  onOpenCarfaxReport={(selected) => setCarfaxReportModalCar(selected)}
                  onOpenCompsModal={(selected) => setCompsModalCar(selected)}
                  onOpenDetailModal={(selected) => setDetailModalCar(selected)}
                  onOpenTradeModal={(selected) => {
                    setTradeModalCar(selected);
                    setIsTradeModalOpen(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <ComparisonMatrix
              cars={filteredCars}
              selectedCarForSideCarfax={selectedCarForSideCarfax}
              onSelectForCarfax={(selected) => {
                setSelectedCarForSideCarfax(selected);
                setIsSideCarfaxOpen(true);
              }}
              onOpenCarfaxReport={(selected) => setCarfaxReportModalCar(selected)}
              onOpenCompsModal={(selected) => setCompsModalCar(selected)}
              onOpenDetailModal={(selected) => setDetailModalCar(selected)}
              onOpenTradeModal={(selected) => {
                setTradeModalCar(selected);
                setIsTradeModalOpen(true);
              }}
            />
          )}
        </main>

        {/* Right Side Column: Embedded CARFAX Side Dock and US Dealerships Directory right under it */}
        {isSideCarfaxOpen && (
          <aside className="w-full lg:w-[440px] xl:w-[480px] shrink-0 flex flex-col gap-4">
            {/* Quick Right Side Mode Selector */}
            <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 grid grid-cols-4 gap-1 text-[11px]">
              <button
                onClick={() => setRightPanelTab('both')}
                className={`py-1.5 px-1 rounded font-bold transition-all text-center ${
                  rightPanelTab === 'both'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Stacked
              </button>
              <button
                onClick={() => setRightPanelTab('carfax')}
                className={`py-1.5 px-1 rounded font-bold transition-all flex items-center justify-center gap-1 ${
                  rightPanelTab === 'carfax'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>CARFAX</span>
              </button>
              <button
                onClick={() => setRightPanelTab('dealers')}
                className={`py-1.5 px-1 rounded font-bold transition-all flex items-center justify-center gap-1 ${
                  rightPanelTab === 'dealers'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>Dealers</span>
              </button>
              <button
                onClick={() => setRightPanelTab('transport')}
                className={`py-1.5 px-1 rounded font-bold transition-all flex items-center justify-center gap-1 ${
                  rightPanelTab === 'transport'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Truck className="w-3 h-3" />
                <span>Delivery</span>
              </button>
            </div>

            {/* 1. CARFAX Side Panel */}
            {(rightPanelTab === 'both' || rightPanelTab === 'carfax') && (
              <CarfaxSidePanel
                car={selectedCarForSideCarfax}
                isOpen={true}
                onClose={() => setIsSideCarfaxOpen(false)}
                onOpenFullReport={(selected) => setCarfaxReportModalCar(selected)}
                onOpenTradeModal={(selected) => {
                  setTradeModalCar(selected);
                  setIsTradeModalOpen(true);
                }}
                onOpenCompsModal={(selected) => setCompsModalCar(selected)}
                onOpenTransportModal={(selected) => setTransportModalCar(selected)}
                onSelectDealer={handleDealerSelect}
                onFilterByBrand={handleBrandFilter}
              />
            )}

            {/* 2. Nationwide US Dealerships Directory right under CARFAX side dock */}
            {(rightPanelTab === 'both' || rightPanelTab === 'dealers') && (
              <div id="us-dealership-directory">
                <DealershipDirectorySideDock
                  onSelectDealer={handleDealerSelect}
                  onFilterByBrand={handleBrandFilter}
                  onOpenTransportModal={() => setTransportModalCar(selectedCarForSideCarfax)}
                  activeDealerId={selectedDealerFilter?.id}
                  activeBrand={filters.make !== 'all' ? filters.make : undefined}
                />
              </div>
            )}

            {/* 3. Direct Transport & Delivery Panel on Right Side */}
            {rightPanelTab === 'transport' && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-400" />
                    <div>
                      <h3 className="font-bold text-sm text-white font-mono">VEHICLE TRANSPORTERS & DELIVERY</h3>
                      <p className="text-[11px] text-slate-400">Doorstep & Dealer-to-Dealer Logistics</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                    USDOT Insured
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-2">
                  <div className="text-slate-400 text-[10px] uppercase font-mono">Current Vehicle for Delivery</div>
                  <div className="font-bold text-white">
                    {selectedCarForSideCarfax.year} {selectedCarForSideCarfax.make} {selectedCarForSideCarfax.model}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Pickup from: <strong className="text-amber-400">{selectedCarForSideCarfax.dealership.name}</strong> ({selectedCarForSideCarfax.dealership.city}, {selectedCarForSideCarfax.dealership.state})
                  </div>
                </div>

                <button
                  onClick={() => setTransportModalCar(selectedCarForSideCarfax)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Open Full Nationwide Delivery Dispatch</span>
                </button>
              </div>
            )}
          </aside>
        )}
      </div>

      {/* Official CARFAX Report Modal ("Click to Show the Fax") */}
      <CarfaxReportModal
        car={carfaxReportModalCar}
        isOpen={!!carfaxReportModalCar}
        onClose={() => setCarfaxReportModalCar(null)}
      />

      {/* Surrounding Area Price Comps Modal */}
      <SurroundingCompsModal
        car={compsModalCar}
        isOpen={!!compsModalCar}
        onClose={() => setCompsModalCar(null)}
        onSelectVehicle={(selected) => {
          setSelectedCarForSideCarfax(selected);
          setCompsModalCar(null);
        }}
      />

      {/* Trade-In Appraisal & Equity Calculator Modal */}
      <TradeInCalculatorModal
        selectedCar={tradeModalCar || selectedCarForSideCarfax}
        isOpen={isTradeModalOpen}
        onClose={() => setIsTradeModalOpen(false)}
      />

      {/* Detailed Vehicle Inspection Modal */}
      <CarDetailModal
        car={detailModalCar}
        isOpen={!!detailModalCar}
        onClose={() => setDetailModalCar(null)}
        onSelectForCarfax={(selected) => {
          setSelectedCarForSideCarfax(selected);
          setIsSideCarfaxOpen(true);
        }}
        onOpenCarfaxReport={(selected) => setCarfaxReportModalCar(selected)}
        onOpenCompsModal={(selected) => {
          setDetailModalCar(null);
          setCompsModalCar(selected);
        }}
        onOpenTradeModal={(selected) => {
          setDetailModalCar(null);
          setTradeModalCar(selected);
          setIsTradeModalOpen(true);
        }}
      />

      {/* Vehicle Transporters & Nationwide Delivery Logistics Modal */}
      <TransportDeliveryModal
        car={transportModalCar}
        isOpen={!!transportModalCar}
        onClose={() => setTransportModalCar(null)}
      />

      {/* Add New Vehicle & Upload Pictures Modal */}
      <AddCarModal
        isOpen={isAddCarModalOpen}
        onClose={() => setIsAddCarModalOpen(false)}
        onAddCar={handleAddCar}
      />
    </div>
  );
}
