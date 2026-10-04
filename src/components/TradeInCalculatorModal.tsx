import React, { useState } from 'react';
import { Car } from '../types/car';
import { formatCurrency, formatMiles, formatNumber } from '../utils/formatters';
import { 
  X, 
  Calculator, 
  DollarSign, 
  Car as CarIcon, 
  TrendingUp, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface TradeInCalculatorModalProps {
  selectedCar: Car | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TradeInCalculatorModal: React.FC<TradeInCalculatorModalProps> = ({
  selectedCar,
  isOpen,
  onClose,
}) => {
  // User trade input states
  const [tradeYear, setTradeYear] = useState<number>(2020);
  const [tradeMake, setTradeMake] = useState<string>('BMW');
  const [tradeModel, setTradeModel] = useState<string>('330i xDrive');
  const [tradeMileage, setTradeMileage] = useState<number>(45000);
  const [tradeCondition, setTradeCondition] = useState<'clean' | 'average' | 'rough'>('clean');
  const [loanPayoff, setLoanPayoff] = useState<number>(18500);

  // Financing calculation inputs
  const [downPayment, setDownPayment] = useState<number>(5000);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [aprInterest, setAprInterest] = useState<number>(6.99);

  if (!isOpen) return null;

  // Calculate simulated trade value based on year, mileage, and condition
  const baseValue = Math.max(12000, 38000 - (2024 - tradeYear) * 3500 - (tradeMileage / 1000) * 120);
  const conditionMultiplier = tradeCondition === 'clean' ? 1.05 : tradeCondition === 'average' ? 0.95 : 0.85;
  const estimatedTradeValue = Math.round(baseValue * conditionMultiplier);
  const netTradeEquity = estimatedTradeValue - loanPayoff;

  // Selected car calculations
  const carPrice = selectedCar ? selectedCar.pricing.dealerPrice : 80000;
  const brandNewPrice = selectedCar ? selectedCar.brandNewComparison.brandNewConfiguredMSRP : 90000;

  // Finance calculation for Used Car:
  const amountToFinanceUsed = Math.max(0, carPrice - downPayment - netTradeEquity);
  const monthlyRateUsed = (aprInterest / 100) / 12;
  const monthlyPaymentUsed = monthlyRateUsed > 0
    ? Math.round(
        (amountToFinanceUsed * (monthlyRateUsed * Math.pow(1 + monthlyRateUsed, loanTermMonths))) /
        (Math.pow(1 + monthlyRateUsed, loanTermMonths) - 1)
      )
    : Math.round(amountToFinanceUsed / loanTermMonths);

  // Finance calculation for Brand New Car:
  const promoAprNew = selectedCar ? selectedCar.brandNewComparison.newFinanceRateAPR : 3.9;
  const amountToFinanceNew = Math.max(0, brandNewPrice - downPayment - netTradeEquity);
  const monthlyRateNew = (promoAprNew / 100) / 12;
  const monthlyPaymentNew = monthlyRateNew > 0
    ? Math.round(
        (amountToFinanceNew * (monthlyRateNew * Math.pow(1 + monthlyRateNew, loanTermMonths))) /
        (Math.pow(1 + monthlyRateNew, loanTermMonths) - 1)
      )
    : Math.round(amountToFinanceNew / loanTermMonths);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Instant Trade-In Valuation & Equity Calculator
                </h2>
                <span className="text-xs bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono px-2 py-0.5 rounded font-bold">
                  MMR-Based
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Appraise your current car & apply net equity against dealer inventory or brand new models
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
          {/* Target Vehicle Banner */}
          {selectedCar && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 truncate">
                <div 
                  className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                  style={{ backgroundColor: selectedCar.exactColor.exteriorHex }}
                />
                <div className="truncate">
                  <span className="text-slate-400 block text-[11px]">Selected Dealership Car:</span>
                  <span className="font-bold text-white truncate block">
                    {selectedCar.year} {selectedCar.make} {selectedCar.model} {selectedCar.trim}
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono">
                <span className="text-slate-400 block text-[10px]">Dealer Price:</span>
                <span className="font-black text-amber-400 text-sm">
                  {formatCurrency(selectedCar.pricing.dealerPrice)}
                </span>
              </div>
            </div>
          )}

          {/* User's Current Car Inputs */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CarIcon className="w-4 h-4 text-emerald-400" />
              <span>Step 1: Enter Your Current Vehicle Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Model Year</label>
                <select
                  value={tradeYear}
                  onChange={(e) => setTradeYear(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                >
                  {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Make</label>
                <input
                  type="text"
                  value={tradeMake}
                  onChange={(e) => setTradeMake(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Model & Trim</label>
                <input
                  type="text"
                  value={tradeModel}
                  onChange={(e) => setTradeModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Current Mileage</label>
                <input
                  type="number"
                  value={tradeMileage}
                  onChange={(e) => setTradeMileage(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Condition & Loan Payoff */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800 text-xs">
              <div>
                <label className="block text-slate-400 mb-1.5 font-medium">Vehicle Condition</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['clean', 'average', 'rough'] as const).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setTradeCondition(cond)}
                      className={`py-2 px-3 rounded-lg capitalize font-semibold border transition-all text-xs ${
                        tradeCondition === cond
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">
                  Current Loan Payoff / Amount Owed ($)
                </label>
                <input
                  type="number"
                  value={loanPayoff}
                  onChange={(e) => setLoanPayoff(Number(e.target.value))}
                  placeholder="0 if car is owned outright"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Trade Appraisal Result & Net Equity */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Step 2: Instant Trade Equity Calculation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center">
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  ESTIMATED TRADE OFFER
                </span>
                <span className="text-2xl font-black text-white block mt-1">
                  {formatCurrency(estimatedTradeValue)}
                </span>
                <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                  Based on wholesale auction MMR
                </span>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                  LESS LOAN PAYOFF
                </span>
                <span className="text-2xl font-black text-rose-400 block mt-1">
                  -{formatCurrency(loanPayoff)}
                </span>
                <span className="text-[10px] text-slate-500 font-sans block mt-0.5">
                  Dealer pays off your lender
                </span>
              </div>

              <div className="bg-slate-900 border border-emerald-500/50 p-3.5 rounded-xl">
                <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold block">
                  NET TRADE EQUITY
                </span>
                <span className={`text-2xl font-black block mt-1 ${
                  netTradeEquity >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {netTradeEquity >= 0 ? `+${formatCurrency(netTradeEquity)}` : formatCurrency(netTradeEquity)}
                </span>
                <span className="text-[10px] text-slate-400 font-sans block mt-0.5">
                  Applied directly toward purchase
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Compare Monthly Payment - Used Dealer Car vs Brand New Model */}
          {selectedCar && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>Step 3: Monthly Payment with Trade Applied (Used vs. Brand New)</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {loanTermMonths} Mo Term · {formatCurrency(downPayment)} Cash Down
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Used Car Payment */}
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">This Used {selectedCar.year} Model</span>
                    <span className="text-amber-400 font-mono font-bold">
                      {formatCurrency(carPrice)}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    {formatCurrency(monthlyPaymentUsed)}
                    <span className="text-xs text-slate-400 font-normal"> /mo</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Financed: {formatCurrency(amountToFinanceUsed)} @ {aprInterest}% APR
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
                    Odometer: {formatMiles(selectedCar.mileage)} · Ready for immediate drive-off
                  </div>
                </div>

                {/* Brand New Car Payment */}
                <div className="bg-slate-900 border border-amber-500/40 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">Brand New {selectedCar.brandNewComparison.brandNewYear} Model</span>
                    <span className="text-amber-400 font-mono font-bold">
                      {formatCurrency(brandNewPrice)}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono">
                    {formatCurrency(monthlyPaymentNew)}
                    <span className="text-xs text-slate-400 font-normal"> /mo</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Financed: {formatCurrency(amountToFinanceNew)} @ {promoAprNew}% Promo APR
                  </div>
                  <div className="text-[10px] text-emerald-400 pt-1 border-t border-slate-800 font-semibold">
                    0 miles · Full factory warranty · Promo low interest rate
                  </div>
                </div>
              </div>

              {/* Spread analysis note */}
              <div className="bg-slate-900/60 p-3 rounded-lg text-xs text-slate-300 border border-slate-800 flex items-center justify-between">
                <span>Payment Difference:</span>
                <span className="font-mono font-bold text-white">
                  {monthlyPaymentNew <= monthlyPaymentUsed ? (
                    <span className="text-emerald-400">
                      Brand New is {formatCurrency(monthlyPaymentUsed - monthlyPaymentNew)}/mo LESS than used!
                    </span>
                  ) : (
                    <span className="text-amber-400">
                      Used saves {formatCurrency(monthlyPaymentNew - monthlyPaymentUsed)}/mo over brand new
                    </span>
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Official trade values subject to dealer visual and physical inspection.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Apply Valuation
          </button>
        </div>
      </div>
    </div>
  );
};
