import { useState, useMemo } from 'react';
import { PieChart, DollarSign, Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function BudgetPlannerCalculator() {
  const [income, setIncome] = useState(5000);
  const [fixedExpenses, setFixedExpenses] = useState(2500);
  const [variableExpenses, setVariableExpenses] = useState(1200);
  const [savingsGoal, setSavingsGoal] = useState(800);

  const result = useMemo(() => {
    const inc = Math.max(0, Number(income));
    const fixed = Math.max(0, Number(fixedExpenses));
    const variable = Math.max(0, Number(variableExpenses));
    const goal = Math.max(0, Number(savingsGoal));

    const totalExpenses = fixed + variable;
    const balance = inc - totalExpenses;
    const isOverspent = balance < 0;
    const goalMet = balance >= goal;
    
    let savingsRatio = 0;
    if (inc > 0) {
      savingsRatio = ((balance > 0 ? balance : 0) / inc) * 100;
    }

    return { totalExpenses, balance, isOverspent, goalMet, savingsRatio };
  }, [income, fixedExpenses, variableExpenses, savingsGoal]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Monthly Net Income</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="input-calc pl-9 text-lg font-medium text-primary"
                type="number"
                min="0"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Fixed Expenses (Rent, Bills)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={fixedExpenses}
                onChange={(e) => setFixedExpenses(Number(e.target.value))}
                className="input-calc pl-9"
                type="number"
                min="0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Variable Expenses (Food, Fun)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={variableExpenses}
                onChange={(e) => setVariableExpenses(Number(e.target.value))}
                className="input-calc pl-9"
                type="number"
                min="0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 pt-2 border-t border-border">
            <label className="text-sm font-medium text-muted-foreground">Target Savings Goal</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(Number(e.target.value))}
                className="input-calc pl-9"
                type="number"
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col justify-between">
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-primary" /> Budget Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Income</span>
                <span className="font-medium">${income.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Expenses</span>
                <span className="font-medium text-destructive">${result.totalExpenses.toFixed(2)}</span>
              </div>
              <div className="h-px bg-border my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Remaining Balance</span>
                <span className={`text-xl font-bold ${result.isOverspent ? 'text-destructive' : 'text-primary'}`}>
                  ${result.balance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className={`mt-6 p-4 rounded-xl border ${result.isOverspent ? 'bg-destructive/10 border-destructive/20' : result.goalMet ? 'bg-primary/10 border-primary/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
             <div className="flex gap-3">
               {result.isOverspent ? (
                 <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
               ) : result.goalMet ? (
                 <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
               ) : (
                 <Wallet className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
               )}
               <div>
                  <h4 className={`text-sm font-bold ${result.isOverspent ? 'text-destructive' : result.goalMet ? 'text-primary' : 'text-orange-500'}`}>
                    {result.isOverspent ? "Over Budget!" : result.goalMet ? "Goal Achieved!" : "Goal Missed"}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {result.isOverspent 
                      ? `You are spending $${Math.abs(result.balance).toFixed(2)} more than you make.` 
                      : result.goalMet 
                        ? `You have enough balance to comfortably save $${savingsGoal}.` 
                        : `You are short by $${(savingsGoal - result.balance).toFixed(2)} to reach your savings target.`}
                  </p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
