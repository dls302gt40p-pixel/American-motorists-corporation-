import React, { useState } from 'react';
import { Car } from '../types/car';
import { formatCurrency } from '../utils/formatters';
import { 
  Truck, 
  X, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Building2, 
  User, 
  Phone, 
  Calendar,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

interface TransportDeliveryModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransportDeliveryModal: React.FC<TransportDeliveryModalProps> = ({
  car,
  isOpen,
  onClose,
}) => {
  const [buyerType, setBuyerType] = useState<'individual' | 'dealer'>('individual');
  const [carrierType, setCarrierType] = useState<'enclosed' | 'open' | 'expedited'>('enclosed');
  const [destinationZip, setDestinationZip] = useState<string>('75001'); // Dallas, TX default
  const [destinationCityState, setDestinationCityState] = useState<string>('Dallas, TX');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [dealerLicenseNumber, setDealerLicenseNumber] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isBooked, setIsBooked] = useState<boolean>(false);

  if (!isOpen || !car) return null;

  // Rough distance calculation based on zip (simulated realistic mileage)
  const estimatedMiles = destinationZip.startsWith('9') ? 45 : destinationZip.startsWith('7') ? 1420 : destinationZip.startsWith('3') ? 2200 : 950;
  
  // Rate calculation
  const ratePerMile = carrierType === 'enclosed' ? 1.65 : carrierType === 'expedited' ? 2.25 : 1.15;
  const baseTransportCost = Math.round(estimatedMiles * ratePerMile);
  const insuranceFee = 45;
  const dispatchFee = 75;
  const totalCost = baseTransportCost + insuranceFee + dispatchFee;

  const estimatedDays = estimatedMiles < 300 ? '1-2 Days' : estimatedMiles < 1200 ? '2-4 Days' : '4-6 Days';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsBooked(true);
    }, 800);
  };

  const handleReset = () => {
    setIsBooked(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 font-black">
              <Truck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">
                  NATIONWIDE VEHICLE DELIVERY & TRANSPORTERS
                </h2>
                <span className="text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded">
                  FMCSA / USDOT CERTIFIED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Doorstep delivery for individuals & lot-to-lot transport for auto dealerships across all 50 states.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isBooked ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Transport Dispatch Requested!</h3>
              <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                A licensed automotive carrier has been notified for pickup at <span className="text-amber-400 font-semibold">{car.dealership.name}</span>.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono max-w-md mx-auto text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Dispatch Reference:</span>
                <span className="text-amber-400 font-bold">AMC-TRK-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vehicle:</span>
                <span className="text-white">{car.year} {car.make} {car.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Buyer Type:</span>
                <span className="text-slate-200 capitalize">{buyerType} Delivery</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Carrier Service:</span>
                <span className="text-slate-200 capitalize">{carrierType} Hauler</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2 font-bold">
                <span className="text-slate-300">Estimated Quote:</span>
                <span className="text-emerald-400 text-sm">{formatCurrency(totalCost)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              The assigned driver & transport logistics coordinator will reach out shortly via phone/email with real-time GPS tracking link.
            </p>

            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              Done & Return to Listings
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Vehicle Details Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                  style={{ backgroundColor: car.exactColor.exteriorHex }}
                  title={car.exactColor.exteriorName}
                />
                <div>
                  <div className="font-bold text-white text-sm">
                    {car.year} {car.make} {car.model} <span className="text-slate-400 font-normal">({car.trim})</span>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    VIN: {car.vin} · {car.horsepower} HP · {car.drivetrain}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-slate-400 text-[10px] uppercase font-mono">Dealership Location</div>
                <div className="font-semibold text-amber-400 text-xs">{car.dealership.city}, {car.dealership.state}</div>
              </div>
            </div>

            {/* Buyer Type Switcher: Individual vs Dealership */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
                1. Select Delivery Destination Category:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setBuyerType('individual')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    buyerType === 'individual'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <User className={`w-5 h-5 shrink-0 mt-0.5 ${buyerType === 'individual' ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-bold text-xs text-white">Individual Private Buyer</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Direct doorstep delivery to your residential home or office address.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBuyerType('dealer')}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    buyerType === 'dealer'
                      ? 'bg-amber-500/10 border-amber-500 text-white shadow-sm ring-1 ring-amber-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Building2 className={`w-5 h-5 shrink-0 mt-0.5 ${buyerType === 'dealer' ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="font-bold text-xs text-white">Automotive Dealer / B2B</div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Lot-to-lot commercial transport between franchised or independent dealer facilities.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Carrier Service Type */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2 font-semibold">
                2. Carrier Equipment Type:
              </label>
              <div className="grid grid-cols-3 gap-2.5 text-xs">
                <button
                  type="button"
                  onClick={() => setCarrierType('enclosed')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    carrierType === 'enclosed'
                      ? 'bg-slate-800 border-amber-500 text-white ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-amber-400">Enclosed Carrier</div>
                  <div className="text-[11px] text-slate-300 mt-1">Recommended for high-performance exotics & mint classics</div>
                  <div className="font-mono text-[10px] text-slate-400 mt-1">100% Weather Shield</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCarrierType('open')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    carrierType === 'open'
                      ? 'bg-slate-800 border-amber-500 text-white ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-white">Open Multi-Hauler</div>
                  <div className="text-[11px] text-slate-300 mt-1">Standard commercial auto carrier, lowest cost</div>
                  <div className="font-mono text-[10px] text-emerald-400 mt-1">Best Value ($1.15/mi)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setCarrierType('expedited')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    carrierType === 'expedited'
                      ? 'bg-slate-800 border-amber-500 text-white ring-1 ring-amber-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-rose-400">Expedited Hot-Shot</div>
                  <div className="text-[11px] text-slate-300 mt-1">Dedicated direct route driver, fastest turnaround</div>
                  <div className="font-mono text-[10px] text-amber-300 mt-1">1–2 Day Transit</div>
                </button>
              </div>
            </div>

            {/* Route & Delivery Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Pickup Location (Dealership)</span>
                <div className="font-bold text-white">{car.dealership.name}</div>
                <div className="text-slate-400 text-[11px]">{car.dealership.address}</div>
                <div className="text-slate-400 text-[11px]">{car.dealership.city}, {car.dealership.state} {car.dealership.zip}</div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase">Delivery Destination</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={destinationZip}
                    onChange={(e) => setDestinationZip(e.target.value)}
                    placeholder="Zip Code (e.g. 75001)"
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                  <input
                    type="text"
                    value={destinationCityState}
                    onChange={(e) => setDestinationCityState(e.target.value)}
                    placeholder="City, State"
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder={buyerType === 'dealer' ? "Dealership Lot Address" : "Street Address (Residential or Commercial)"}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  {buyerType === 'dealer' ? 'Dealer Contact Name' : 'Full Name'}
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Robert Vance"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Direct Phone</label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  {buyerType === 'dealer' ? 'Dealer License # (Optional)' : 'Email'}
                </label>
                <input
                  type={buyerType === 'dealer' ? 'text' : 'email'}
                  value={buyerType === 'dealer' ? dealerLicenseNumber : contactEmail}
                  onChange={(e) => buyerType === 'dealer' ? setDealerLicenseNumber(e.target.value) : setContactEmail(e.target.value)}
                  placeholder={buyerType === 'dealer' ? "DL-XXXXX" : "you@example.com"}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Instant Delivery Quote Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-white font-bold">$1,000,000 Verified Cargo Insurance Included</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Estimated Distance: <span className="text-white">{estimatedMiles} Miles</span> · Transit Window: <span className="text-amber-400">{estimatedDays}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block uppercase">Guaranteed Transport Quote</span>
                <span className="text-xl font-black text-emerald-400">
                  {formatCurrency(totalCost)}
                </span>
              </div>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Truck className="w-4 h-4" />
              <span>
                {isSubmitting ? 'Dispatching Carrier Request...' : 'Book Transport Delivery / Request Dispatch'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
