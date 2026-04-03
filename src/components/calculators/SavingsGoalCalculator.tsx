import { useState, useMemo } from 'react';
import { Target, TrendingUp, Calendar, PiggyBank } from 'lucide-react';

export function SavingsGoalCalculator() {
  const [tab, setTab] = useState<'fd' | 'rd' | 'goal'>('goal');
  
  // States suitable for all tabs
  const [principal, setPrincipal] = useState(5000);
  const [monthlyDeposit, setMonthlyDeposit] = useState(200);
  const [interestRate, setInterestRate] = useState(6);
  const [years, setYears] = useState(5);
  const [targetGoal, setTargetGoal] = useState(20000);

  const result = useMemo(() => {
    const P = Math.max(0, Number(principal));
    const M = Math.max(0, Number(monthlyDeposit));
    const r = Math.max(0, Number(interestRate)) / 100 / 12;
    const n = Math.max(0, Number(years)) * 12;
    const G = Math.max(0, Number(targetGoal));

    if (tab === 'fd') {
      // Fixed Deposit: P * (1 + r)^n
      const futureValue = P * Math.pow(1 + r, n);
      return { futureValue, totalInvested: P, interestEarned: futureValue - P };
    } 
    
    if (tab === 'rd') {
      // Recurring Deposit: M * ((1+r)^n - 1)/r
      // Assuming deposit at beginning of month
      const futureValue = M * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      const totalInvested = M * n;
      return { futureValue, totalInvested, interestEarned: futureValue - totalInvested };
    }

    // Goal Mode: P*(1+r)^n + M*(((1+r)^n-1)/r)*(1+r)
    let futureValue = 0;
    if (r === 0) {
      futureValue = P + (M * n);
    } else {
      futureValue = P * Math.pow(1 + r, n) + M * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    }
    
    const requiredMonthlyBase = G - (P * Math.pow(1 + r, n));
    let requiredMonthly = 0;
    if (r === 0) {
       requiredMonthly = (G - P) / (n || 1);
    } else {
       requiredMonthly = requiredMonthlyBase / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
    }

    return {
      futureValue,
      requiredMonthly: Math.max(0, requiredMonthly),
      shortfall: Math.max(0, G - futureValue),
      goalMet: futureValue >= G
    };
  }, [tab, principal, monthlyDeposit, interestRate, years, targetGoal]);

  return (
    <div className="space-y-6">
      <div className="flex bg-secondary/50 p-1 rounded-xl">
        <button onClick={() => setTab('fd')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${tab === 'fd' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>Fixed Deposit</button>
        <button onClick={() => setTab('rd')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${tab === 'rd' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>Recurring Deposit</button>
        <button onClick={() => setTab('goal')} className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${tab === 'goal' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'}`}>Target Goal</button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          {tab === 'goal' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Target Amount</label>
              <input placeholder="e.g. 5000" value={targetGoal} onChange={(e) => setTargetGoal(Number(e.target.value))} className="input-calc font-medium text-primary" type="number" min="0" />
            </div>
          )}

          {(tab === 'fd' || tab === 'goal') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Initial Deposit / Principal</label>
              <input placeholder="e.g. 5000" value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="input-calc" type="number" min="0" />
            </div>
          )}

          {(tab === 'rd' || tab === 'goal') && (
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Monthly Deposit</label>
              <input placeholder="e.g. 12" value={monthlyDeposit} onChange={(e) => setMonthlyDeposit(Number(e.target.value))} className="input-calc" type="number" min="0" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Interest Rate (%)</label>
              <input placeholder="e.g. 5.5" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="input-calc" type="number" step="0.1" min="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Time (Years)</label>
              <input placeholder="e.g. 5.5" value={years} onChange={(e) => setYears(Number(e.target.value))} className="input-calc" type="number" min="0.1" step="0.5" />
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col justify-center">
          {(tab === 'fd' || tab === 'rd') && result.futureValue !== undefined ? (
            <div className="space-y-6 text-center">
              <div>
                <PiggyBank className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Maturity Value</h4>
                <div className="text-3xl font-bold gradient-text">${result.futureValue.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-background rounded-lg p-3">
                  <div className="text-muted-foreground mb-1">Total Invested</div>
                  <div className="font-semibold">${result.totalInvested?.toFixed(2)}</div>
                </div>
                <div className="bg-background rounded-lg p-3">
                  <div className="text-muted-foreground mb-1">Interest Earned</div>
                  <div className="font-semibold text-primary">+${result.interestEarned?.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="text-center">
                <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Projected Final Amount</h4>
                <div className={`text-3xl font-bold ${result.goalMet ? 'text-primary' : 'text-foreground'}`}>
                  ${result.futureValue.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {result.goalMet ? 'You will hit your target!' : `Short by $${result.shortfall.toFixed(2)}`}
                </div>
              </div>

              <div className="bg-background rounded-lg p-4 border border-border/50 text-center">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">To reach your goal, save:</h4>
                <div className="text-xl font-bold">${result.requiredMonthly.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ month</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
