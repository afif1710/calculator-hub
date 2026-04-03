import { useState, useMemo } from 'react';
import { Palmtree, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export function RetirementPlannerCalculator() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('50000');
  const [monthlyContribution, setMonthlyContribution] = useState('1000');
  const [returnRate, setReturnRate] = useState('7');
  const [targetCorpus, setTargetCorpus] = useState('1500000');

  const result = useMemo(() => {
    const ageNow = Math.max(1, Number(currentAge));
    const ageRetire = Math.max(ageNow + 1, Number(retirementAge));
    const principal = Math.max(0, Number(currentSavings));
    const monthly = Math.max(0, Number(monthlyContribution));
    const rate = Math.max(0, Number(returnRate)) / 100 / 12;
    const target = Math.max(0, Number(targetCorpus));

    const years = ageRetire - ageNow;
    const n = years * 12;

    let projected = 0;
    if (rate === 0) {
      projected = principal + (monthly * n);
    } else {
      projected = principal * Math.pow(1 + rate, n) + monthly * ((Math.pow(1 + rate, n) - 1) / rate) * (1 + rate);
    }

    const diff = projected - target;
    const isOnTrack = diff >= 0;

    // Required monthly to hit target
    const requiredMonthlyBase = target - (principal * Math.pow(1 + rate, n));
    const requiredMonthly = requiredMonthlyBase > 0 
      ? requiredMonthlyBase / (((Math.pow(1 + rate, n) - 1) / rate) * (1 + rate))
      : 0;

    return { projected, diff, isOnTrack, years, requiredMonthly: Math.max(0, requiredMonthly) };
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, returnRate, targetCorpus]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Current Age</label>
              <input placeholder="e.g. 12" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className="input-calc py-2 text-sm" type="number" min="1" max="100" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Retirement Age</label>
              <input placeholder="e.g. 12" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} className="input-calc py-2 text-sm" type="number" min={currentAge + 1} max="120" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Target Retirement Corpus</label>
            <input placeholder="e.g. 5000" value={targetCorpus} onChange={(e) => setTargetCorpus(e.target.value)} className="input-calc py-2 text-sm" type="number" min="0" step="10000" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Current Savings</label>
            <input placeholder="e.g. 5000" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} className="input-calc py-2 text-sm" type="number" min="0" step="1000" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Monthly Adding</label>
              <input placeholder="e.g. 12" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} className="input-calc py-2 text-sm" type="number" min="0" step="100" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Return Rate (%)</label>
              <input placeholder="e.g. 5.5" value={returnRate} onChange={(e) => setReturnRate(e.target.value)} className="input-calc py-2 text-sm" type="number" min="0" step="0.5" />
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col justify-between">
          <div className="text-center mb-6">
            <Palmtree className="w-8 h-8 text-primary mx-auto mb-2" />
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Projected Savings in {result.years} years</h4>
            <div className="text-3xl font-bold gradient-text">${(result.projected / 1000000).toFixed(2)}M</div>
            <div className="text-xs text-muted-foreground mt-1">
              Exact: ${Math.round(result.projected).toLocaleString()}
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-start gap-3 ${result.isOnTrack ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'}`}>
            {result.isOnTrack ? (
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className={`text-sm font-bold ${result.isOnTrack ? 'text-primary' : 'text-destructive'}`}>
                {result.isOnTrack ? "You are on track!" : "Falling short"}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                {result.isOnTrack 
                  ? `You will have a surplus of $${Math.abs(result.diff).toLocaleString(undefined, {maximumFractionDigits:0})}` 
                  : `You need an extra $${Math.abs(result.diff).toLocaleString(undefined, {maximumFractionDigits:0})} to reach your goal.`}
              </p>
            </div>
          </div>

          {!result.isOnTrack && (
            <div className="mt-4 bg-background rounded-lg p-3 border border-border/50 text-center">
              <div className="text-xs text-muted-foreground mb-1">Required monthly to hit target:</div>
              <div className="font-semibold text-primary">${Math.round(result.requiredMonthly).toLocaleString()} / month</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
