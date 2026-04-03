import { useState, useMemo } from 'react';
import { DollarSign, Wallet, Plus, Trash2, PieChart } from 'lucide-react';

interface Expense {
  id: number;
  name: string;
  amount: number;
  type: 'recurring' | 'one-time';
}

export function ExpenseTrackerCalculator() {
  const [income, setIncome] = useState('4000');
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, name: 'Rent', amount: 1200, type: 'recurring' },
    { id: 2, name: 'Groceries', amount: 400, type: 'recurring' },
    { id: 3, name: 'Dining Out', amount: 150, type: 'one-time' },
  ]);

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now(), name: 'New Expense', amount: 0, type: 'recurring' }]);
  };

  const updateExpense = (id: number, field: keyof Expense, value: string | number) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeExpense = (id: number) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const result = useMemo(() => {
    const totalIncome = Math.max(0, Number(income));
    
    let recurring = 0;
    let onetime = 0;

    expenses.forEach(e => {
      const amt = Math.max(0, Number(e.amount));
      if (e.type === 'recurring') recurring += amt;
      else onetime += amt;
    });

    const totalExpenses = recurring + onetime;
    const savingsLeft = totalIncome - totalExpenses;

    return { recurring, onetime, totalExpenses, savingsLeft };
  }, [income, expenses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted-foreground">Monthly Monthly Net Income</label>
        <div className="relative max-w-sm">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            className="input-calc pl-9 text-lg font-medium text-primary"
            type="number"
            min="0"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <h3 className="font-medium">Expenses</h3>
            <button onClick={addExpense} className="flex items-center gap-1 text-sm text-primary hover:text-primary/80">
              <Plus className="w-4 h-4" /> Add Expense
            </button>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex items-center gap-2">
                <input
                  value={expense.name}
                  onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                  className="input-calc flex-1 py-2 text-sm"
                  type="text"
                  placeholder="Expense name"
                />
                <div className="relative w-32 shrink-0">
                  <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    value={expense.amount}
                    onChange={(e) => updateExpense(expense.id, 'amount', Number(e.target.value))}
                    className="input-calc pl-7 py-2 text-sm"
                    type="number"
                    min="0"
                  />
                </div>
                <select 
                  value={expense.type}
                  onChange={(e) => updateExpense(expense.id, 'type', e.target.value)}
                  className="input-calc w-28 py-2 text-sm shrink-0"
                >
                  <option value="recurring">Recurring</option>
                  <option value="one-time">One-time</option>
                </select>
                <button onClick={() => removeExpense(expense.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col justify-between">
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-primary" /> Cashflow Summary
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Recurring Expenses</span>
                <span className="font-medium">${result.recurring.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">One-time Expenses</span>
                <span className="font-medium">${result.onetime.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-border">
                <span className="text-muted-foreground font-medium">Total Expenses</span>
                <span className="font-bold text-destructive">${result.totalExpenses.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={`mt-6 p-4 rounded-xl border ${result.savingsLeft >= 0 ? 'bg-primary/10 border-primary/20' : 'bg-destructive/10 border-destructive/20'}`}>
            <h4 className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Savings Left</h4>
            <div className={`text-2xl font-bold flex items-center gap-2 ${result.savingsLeft >= 0 ? 'text-primary' : 'text-destructive'}`}>
               <Wallet className="w-5 h-5" /> ${result.savingsLeft.toFixed(2)}
            </div>
            {result.savingsLeft < 0 && (
              <p className="text-xs text-destructive mt-1">You are overspending by ${Math.abs(result.savingsLeft).toFixed(2)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
