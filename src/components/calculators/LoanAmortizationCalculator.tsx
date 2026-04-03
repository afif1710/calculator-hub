import { useState, useMemo } from 'react';
import { Landmark, CalendarDays, TrendingDown } from 'lucide-react';

export function LoanAmortizationCalculator() {
  const [principal, setPrincipal] = useState(250000);
  const [rate, setRate] = useState(5.5);
  const [years, setYears] = useState(30);
  const [extraPayment, setExtraPayment] = useState(0);

  const result = useMemo(() => {
    const p = Math.max(0, Number(principal));
    const rAnn = Math.max(0, Number(rate));
    const y = Math.max(1, Number(years));
    const extra = Math.max(0, Number(extraPayment));

    const r = rAnn / 100 / 12;
    const n = y * 12;

    let monthly = 0;
    if (r > 0) {
      monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      monthly = p / n;
    }

    // Amortization logic to calculate payoff time and interest with extra payment
    let balance = p;
    let totalInterest = 0;
    let actualMonths = 0;

    // Safety limit to avoid infinite loops
    while (balance > 0 && actualMonths < 1200) {
      const interestForMonth = balance * r;
      totalInterest += interestForMonth;
      
      let principalPaid = (monthly + extra) - interestForMonth;
      if (principalPaid > balance) {
        principalPaid = balance;
      }
      
      balance -= principalPaid;
      actualMonths++;
    }

    const timeSavedMonths = n - actualMonths;
    const baseTotalInterest = (monthly * n) - p; // Interet without extra payments
    const interestSaved = baseTotalInterest - totalInterest;

    return { 
      monthly, 
      totalInterest, 
      totalPaid: p + totalInterest,
      actualMonths,
      timeSavedMonths,
      interestSaved
    };
  }, [principal, rate, years, extraPayment]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Loan Amount</label>
            <input placeholder="e.g. 5000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="input-calc" type="number" min="0" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Interest Rate (%)</label>
              <input placeholder="e.g. 5.5" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="input-calc" type="number" step="0.1" min="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Term (Years)</label>
              <input placeholder="e.g. 5.5" value={years} onChange={(e) => setYears(Number(e.target.value))} className="input-calc" type="number" min="1" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
            <label className="text-sm font-medium text-muted-foreground">Optional Extra Monthly Payment</label>
            <input placeholder="e.g. 12" value={extraPayment} onChange={(e) => setExtraPayment(Number(e.target.value))} className="input-calc" type="number" min="0" />
          </div>
        </div>

        <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1 text-center">Base Monthly Payment</h3>
            <div className="text-4xl font-bold gradient-text text-center mb-6">
              ${result.monthly.toFixed(2)}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm bg-background p-2.5 rounded-lg">
                <span className="text-muted-foreground flex items-center gap-2"><Landmark className="w-4 h-4" /> Total Interest Paid</span>
                <span className="font-semibold text-destructive">${result.totalInterest.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm bg-background p-2.5 rounded-lg">
                <span className="text-muted-foreground">Total of Payments</span>
                <span className="font-semibold">${result.totalPaid.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {extraPayment > 0 && (
            <div className="mt-5 p-4 rounded-xl bg-primary/10 border border-primary/20">
              <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4" /> Extra Payment Impact
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>You save <strong className="text-foreground">${result.interestSaved.toFixed(2)}</strong> in interest.</p>
                <p>Payoff time shortened by <strong className="text-foreground">{Math.floor(result.timeSavedMonths / 12)} yrs {result.timeSavedMonths % 12} mos</strong>.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
