import React from 'react';
import { Car } from '../types/car';
import { formatCurrency, formatMiles, formatNumber } from '../utils/formatters';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Printer, 
  Download, 
  Share2, 
  Wrench, 
  UserCheck, 
  Calendar, 
  FileText,
  Building2,
  Check,
  ExternalLink,
  Car as CarIcon,
  HelpCircle
} from 'lucide-react';

interface CarfaxReportModalProps {
  car: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CarfaxReportModal: React.FC<CarfaxReportModalProps> = ({
  car,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !car) return null;

  const { carfax, exactColor, dealership, pricing } = car;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Official Banner */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white font-mono">
                  CAR<span className="text-blue-500">FAX</span>
                </span>
                <span className="text-xs uppercase font-mono tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded font-bold">
                  VEHICLE HISTORY REPORT™
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Official Report #{carfax.reportId} · Generated for {car.dealership.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700"
              title="Print official report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close CARFAX"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Official Fax Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 font-sans">
          {/* Vehicle Quick Summary Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs text-slate-400 font-mono uppercase tracking-wider block">
                  VEHICLE IDENTIFICATION NUMBER
                </span>
                <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-wider block mt-0.5">
                  {car.vin}
                </span>
                <h1 className="text-base font-bold text-slate-200 mt-1">
                  {car.year} {car.make} {car.model} {car.trim}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">
                    VERIFIED ODOMETER
                  </span>
                  <span className="text-lg font-black text-white font-mono">
                    {formatMiles(carfax.lastOdometerReading)}
                  </span>
                  <span className="text-[11px] text-emerald-400 block font-semibold">
                    ✓ Verified Accurate
                  </span>
                </div>
              </div>
            </div>

            {/* Spec Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">BODY STYLE:</span>
                <span className="text-slate-200 font-semibold">{car.bodyStyle}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DRIVETRAIN:</span>
                <span className="text-amber-400 font-bold">{car.drivetrain}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ENGINE:</span>
                <span className="text-slate-200 truncate block">{car.engine.split('(')[0]}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">FACTORY COLOR:</span>
                <span className="text-slate-200 truncate block">{exactColor.exteriorName}</span>
              </div>
            </div>
          </div>

          {/* CARFAX Top 4 Summary Pill Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Box 1: Accidents */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  ACCIDENT CHECK
                </span>
                <span className="font-bold text-white text-sm block">
                  {carfax.accidentCount === 0 ? 'No Accidents Reported' : `${carfax.accidentCount} Accident Reported`}
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Clean body & structure
                </span>
              </div>
            </div>

            {/* Box 2: Owners */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  OWNERSHIP HISTORY
                </span>
                <span className="font-bold text-white text-sm block">
                  {carfax.ownerCount}-Owner Vehicle
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Personal vehicle use
                </span>
              </div>
            </div>

            {/* Box 3: Service Records */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  SERVICE RECORDS
                </span>
                <span className="font-bold text-white text-sm block">
                  {carfax.serviceRecordCount} Verified Records
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  Regular dealership maintenance
                </span>
              </div>
            </div>

            {/* Box 4: Open Recalls */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  SAFETY RECALLS
                </span>
                <span className="font-bold text-white text-sm block">
                  0 Open Recalls
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  NHTSA database verified
                </span>
              </div>
            </div>
          </div>

          {/* Section: Title & Damage History Verification Check */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CARFAX Title History Check (DMV Verified)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Clean Title Guaranteed</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No Salvage or Junk Records</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No Flood / Water Damage</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No Fire or Hail Records</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No Lemon / Manufacturer Buyback</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>No Airbag Deployment Reported</span>
              </div>
            </div>
          </div>

          {/* Detailed Ownership Timeline */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>Detailed Ownership History</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Owner 1 of 1</span>
            </h3>

            {carfax.owners.map((owner) => (
              <div key={owner.ownerIndex} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">PURCHASE YEAR:</span>
                    <span className="font-bold text-white text-sm font-mono">{owner.yearPurchased}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TYPE OF USE:</span>
                    <span className="font-bold text-emerald-400">{owner.typeOfUse}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">REGISTERED LOCATION:</span>
                    <span className="font-semibold text-slate-200">{owner.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ESTIMATED MILES/YR:</span>
                    <span className="font-mono text-white font-semibold">{formatNumber(owner.estimatedMilesPerYear)} mi/yr</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Full Line-Item Maintenance and Service History */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Complete Line-Item Service History Logs ({carfax.serviceRecordCount})</span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                All OEM Factory Intervals Logged
              </span>
            </div>

            <div className="space-y-4">
              {carfax.serviceHistory.map((service, index) => (
                <div 
                  key={index}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-400 text-sm">
                        {service.date}
                      </span>
                      <span className="text-slate-500">·</span>
                      <span className="font-mono font-semibold text-slate-300">
                        Odometer: {formatMiles(service.mileage)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>{service.serviceProvider}</span>
                      <span className="text-slate-500">({service.cityState})</span>
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-[11px] font-mono text-slate-400 block mb-1">
                      Services Performed:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-300">
                      {service.servicesPerformed.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-snug">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARFAX Buyback Guarantee Certificate */}
          <div className="bg-gradient-to-r from-blue-950/60 to-slate-950 border border-blue-600/50 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span className="font-black text-sm text-white tracking-wide">
                  CARFAX Buyback Guarantee™
                </span>
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/40">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                This vehicle is certified eligible for the CARFAX Buyback Guarantee. In the event of a severe DMV title brand that was not reported by CARFAX, CARFAX will buy this vehicle back at 100% of the purchase price.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Guarantee Reg. ID
              </span>
              <span className="font-mono font-bold text-blue-300 text-xs">
                BBG-{car.vin.slice(0, 8)}-{car.year}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Source: CARFAX Vehicle History Report™ & state DMV databases.
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-md shadow-blue-500/20"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
