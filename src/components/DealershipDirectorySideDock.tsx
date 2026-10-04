import React, { useState, useMemo } from 'react';
import { US_DEALERSHIPS, US_BRANDS, USDealership } from '../data/usDealerships';
import { 
  Building2, 
  MapPin, 
  Search, 
  Phone, 
  ExternalLink, 
  Filter, 
  Car, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  Globe2,
  Layers,
  ArrowUpDown,
  Truck
} from 'lucide-react';

interface DealershipDirectorySideDockProps {
  onSelectDealer: (dealer: USDealership) => void;
  onFilterByBrand: (brand: string) => void;
  onOpenTransportModal?: () => void;
  activeDealerId?: string;
  activeBrand?: string;
}

export const DealershipDirectorySideDock: React.FC<DealershipDirectorySideDockProps> = ({
  onSelectDealer,
  onFilterByBrand,
  onOpenTransportModal,
  activeDealerId,
  activeBrand,
}) => {
  // Mode: 'az' (A-Z List by state/name) or 'brand' (List of brands and their nationwide dealer locations)
  const [directoryMode, setDirectoryMode] = useState<'az' | 'brands'>('az');
  const [showInlineTransport, setShowInlineTransport] = useState<boolean>(false);
  const [transportBuyerType, setTransportBuyerType] = useState<'individual' | 'dealer'>('individual');
  const [transportCarrierType, setTransportCarrierType] = useState<'enclosed' | 'open' | 'expedited'>('enclosed');
  const [destZip, setDestZip] = useState<string>('75001');
  const [destCity, setDestCity] = useState<string>('Dallas, TX');
  const [isTransportDispatched, setIsTransportDispatched] = useState<boolean>(false);
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>(activeBrand || 'All Brands');

  const ALPHABET = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  // Distinct states list
  const stateOptions = useMemo(() => {
    const states = Array.from(new Set(US_DEALERSHIPS.map((d) => d.state))).sort();
    return ['ALL', ...states];
  }, []);

  // Filtered A-Z dealerships
  const filteredAZDealers = useMemo(() => {
    return US_DEALERSHIPS.filter((dealer) => {
      // Letter filter
      if (selectedLetter !== 'ALL') {
        if (!dealer.name.toUpperCase().startsWith(selectedLetter)) {
          return false;
        }
      }

      // State filter
      if (selectedState !== 'ALL') {
        if (dealer.state !== selectedState) {
          return false;
        }
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = dealer.name.toLowerCase().includes(q);
        const matchesCity = dealer.city.toLowerCase().includes(q);
        const matchesState = dealer.stateFullName.toLowerCase().includes(q) || dealer.state.toLowerCase().includes(q);
        const matchesBrand = dealer.brand.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesState && !matchesBrand) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [selectedLetter, selectedState, searchQuery]);

  // Brand-grouped dealers
  const brandGroupedDealers = useMemo(() => {
    if (selectedBrand === 'All Brands') {
      return US_DEALERSHIPS;
    }
    return US_DEALERSHIPS.filter((d) => d.brand.toLowerCase() === selectedBrand.toLowerCase());
  }, [selectedBrand]);

  // Dealers grouped by state for selected brand
  const dealersByState = useMemo(() => {
    const map: Record<string, USDealership[]> = {};
    brandGroupedDealers.forEach((dealer) => {
      if (!map[dealer.stateFullName]) {
        map[dealer.stateFullName] = [];
      }
      map[dealer.stateFullName].push(dealer);
    });
    return map;
  }, [brandGroupedDealers]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-slate-950 px-4 py-3.5 border-b border-slate-800">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white font-mono tracking-tight">
              US DEALERSHIP DIRECTORY
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
            {US_DEALERSHIPS.length} US Locations
          </span>
        </div>
        <p className="text-[11px] text-slate-400">
          Browse all dealerships A–Z or click brands to see their locations across America.
        </p>

        {/* Directory Mode Toggle: A-Z vs Brands */}
        <div className="grid grid-cols-2 gap-1 mt-3 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setDirectoryMode('az')}
            className={`py-1.5 px-2 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
              directoryMode === 'az'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>A–Z Directory (State/Name)</span>
          </button>

          <button
            onClick={() => setDirectoryMode('brands')}
            className={`py-1.5 px-2 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
              directoryMode === 'brands'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Browse by Brand</span>
          </button>
        </div>

        {/* Transporters & Delivery Button right under the 2 buttons */}
        <button
          onClick={() => {
            if (onOpenTransportModal) {
              onOpenTransportModal();
            } else {
              setShowInlineTransport((prev) => !prev);
            }
          }}
          className="w-full mt-2.5 py-2.5 px-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black rounded-lg text-xs transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 border border-amber-400/50 cursor-pointer"
          title="Vehicle transport and delivery for individuals and dealerships"
        >
          <Truck className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>Vehicle Transporters & Delivery (Individual & Dealer B2B)</span>
        </button>

        {/* Inline Quick Transport Drawer if toggled */}
        {showInlineTransport && (
          <div className="mt-2.5 p-3 bg-slate-900/95 border border-amber-500/40 rounded-xl space-y-2.5 text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" />
                <span>Nationwide Transporter Dispatch</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.5 rounded">
                $1M Cargo Insured
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setTransportBuyerType('individual')}
                className={`py-1 px-2 rounded-md font-semibold border text-center transition-all ${
                  transportBuyerType === 'individual'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Individual Delivery
              </button>
              <button
                type="button"
                onClick={() => setTransportBuyerType('dealer')}
                className={`py-1 px-2 rounded-md font-semibold border text-center transition-all ${
                  transportBuyerType === 'dealer'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                Dealer-to-Dealer B2B
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Delivery Destination Zip / City:</span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={destZip}
                  onChange={(e) => setDestZip(e.target.value)}
                  placeholder="Zip"
                  className="w-1/3 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                />
                <input
                  type="text"
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  placeholder="City, State"
                  className="w-2/3 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => setTransportCarrierType('enclosed')}
                className={`py-1 px-1 rounded border text-center ${
                  transportCarrierType === 'enclosed' ? 'bg-slate-800 border-amber-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Enclosed (100% Shield)
              </button>
              <button
                type="button"
                onClick={() => setTransportCarrierType('open')}
                className={`py-1 px-1 rounded border text-center ${
                  transportCarrierType === 'open' ? 'bg-slate-800 border-amber-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Open Multi-Hauler
              </button>
              <button
                type="button"
                onClick={() => setTransportCarrierType('expedited')}
                className={`py-1 px-1 rounded border text-center ${
                  transportCarrierType === 'expedited' ? 'bg-slate-800 border-amber-500 text-white font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Expedited 1-2 Day
              </button>
            </div>

            {isTransportDispatched ? (
              <div className="p-2 bg-emerald-950/40 border border-emerald-600/50 rounded-lg text-center text-emerald-400 font-semibold text-[11px]">
                ✓ Transport Dispatch Request Received! Carrier assigned.
              </div>
            ) : (
              <button
                onClick={() => {
                  if (onOpenTransportModal) {
                    onOpenTransportModal();
                  } else {
                    setIsTransportDispatched(true);
                  }
                }}
                className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors"
              >
                Request Carrier Pickup & Booking ↗
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= MODE 1: A-Z LIST BY STATE AND NAME ================= */}
      {directoryMode === 'az' && (
        <div className="p-3.5 space-y-3">
          {/* Search & State Filter */}
          <div className="flex items-center gap-2 text-xs">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dealer, city, state..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5">
              <span className="text-slate-500 text-[10px]">State:</span>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                aria-label="Filter dealerships by US State"
                className="bg-transparent text-amber-400 font-mono font-medium focus:outline-none cursor-pointer"
              >
                {stateOptions.map((st) => (
                  <option key={st} value={st} className="bg-slate-900 text-white">
                    {st === 'ALL' ? 'All 50 States' : st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Alphabet A-Z Jump Bar */}
          <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-[10px] font-mono">
            {ALPHABET.map((char) => {
              const active = selectedLetter === char;
              return (
                <button
                  key={char}
                  onClick={() => setSelectedLetter(char)}
                  className={`px-1.5 py-0.5 rounded transition-all shrink-0 font-bold ${
                    active
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {char}
                </button>
              );
            })}
          </div>

          {/* Dealer Count */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/60 pb-1.5">
            <span>
              Showing <strong className="text-white">{filteredAZDealers.length}</strong> dealerships A–Z
            </span>
            {selectedState !== 'ALL' && (
              <span className="text-amber-400 font-mono">Filter: State {selectedState}</span>
            )}
          </div>

          {/* Dealers List */}
          <div className="max-h-[360px] overflow-y-auto space-y-2 pr-1">
            {filteredAZDealers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No dealerships found for "{selectedLetter}" in {selectedState}.
              </div>
            ) : (
              filteredAZDealers.map((dealer) => {
                const isActive = activeDealerId === dealer.id;
                return (
                  <div
                    key={dealer.id}
                    className={`bg-slate-950/70 border rounded-lg p-2.5 transition-all text-xs flex flex-col gap-1.5 ${
                      isActive
                        ? 'border-amber-500 bg-amber-950/20 shadow-sm'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold text-[10px] px-1.5 py-0.2 rounded">
                            {dealer.state}
                          </span>
                          <span className="font-bold text-white truncate text-xs">
                            {dealer.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">
                            {dealer.city}, {dealer.stateFullName} · {dealer.address}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-400 shrink-0 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {dealer.brand}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
                      <div className="flex items-center gap-2 text-slate-400 font-mono">
                        <Phone className="w-3 h-3 text-amber-400/80" />
                        <a href={`tel:${dealer.phone}`} className="hover:text-white">
                          {dealer.phone}
                        </a>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={dealer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-white p-1"
                          title="Open official dealership website"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          onClick={() => onSelectDealer(dealer)}
                          className="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 rounded text-[10px] font-bold transition-all flex items-center gap-1"
                        >
                          <span>Search Inventory</span>
                          <ChevronRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ================= MODE 2: DEALERS UNDER BRAND NAMES ================= */}
      {directoryMode === 'brands' && (
        <div className="p-3.5 space-y-3">
          {/* Brand Selection Pills */}
          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1.5">
              Select Automotive Brand to View All US Dealer Locations:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {US_BRANDS.map((brand) => {
                const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
                const count = brand === 'All Brands' 
                  ? US_DEALERSHIPS.length 
                  : US_DEALERSHIPS.filter((d) => d.brand.toLowerCase() === brand.toLowerCase()).length;

                return (
                  <button
                    key={brand}
                    onClick={() => {
                      setSelectedBrand(brand);
                      onFilterByBrand(brand);
                    }}
                    className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{brand}</span>
                    <span className="font-mono text-[9px] opacity-75 bg-black/30 px-1 py-0.2 rounded">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Brand Header */}
          <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                NATIONWIDE DEALER NETWORK
              </span>
              <span className="font-bold text-white text-sm">
                {selectedBrand} Dealers in the US
              </span>
            </div>
            <span className="text-blue-400 font-mono font-bold text-xs bg-blue-950/50 border border-blue-800/40 px-2 py-0.5 rounded">
              {brandGroupedDealers.length} Dealerships Across US
            </span>
          </div>

          {/* State Groupings and Dealers */}
          <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1 text-xs">
            {Object.keys(dealersByState).length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                No dealerships listed for {selectedBrand}.
              </div>
            ) : (
              Object.entries(dealersByState).map(([stateName, dealers]) => (
                <div key={stateName} className="space-y-1.5">
                  <div className="flex items-center justify-between bg-slate-950/90 px-2.5 py-1 rounded border border-slate-800 text-[11px]">
                    <span className="font-bold text-amber-400 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {stateName} ({dealers[0].state})
                    </span>
                    <span className="text-slate-500 font-mono">
                      {dealers.length} {dealers.length === 1 ? 'Dealer' : 'Dealers'}
                    </span>
                  </div>

                  <div className="space-y-1.5 pl-1.5">
                    {dealers.map((dealer) => (
                      <div
                        key={dealer.id}
                        className="bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 rounded-lg p-2.5 flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-white text-xs truncate">
                            {dealer.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {dealer.city}, {dealer.state} · {dealer.phone}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">
                            {dealer.address}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <a
                            href={dealer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-white"
                            title="Visit website"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => onSelectDealer(dealer)}
                            className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition-colors"
                          >
                            Search Dealer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
