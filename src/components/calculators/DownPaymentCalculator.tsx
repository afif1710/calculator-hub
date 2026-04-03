import { useState, useMemo } from 'react';
import { Home, Percent, DollarSign, PieChart } from 'lucide-react';

export function DownPaymentCalculator() {
  const [homePrice, setHomePrice] = useState(300000);
  const [downPercent, setDownPercent] = useState(20);
  const [downAmount, setDownAmount] = useState(60000);
  const [lastEdited, setLastEdited] = useState<'percent' | 'amount'>('percent');

  // Handle cross calculations instantly
  const handlePriceChange = (val: string) => {
    const price = Math.max(0, Number(val));
    setHomePrice(price);
    if (lastEdited === 'percent') {
      setDownAmount(price * (downPercent / 100));
    } else {
      setDownPercent(price > 0 ? (downAmount / price) * 100 : 0);
    }
  };

  const handlePercentChange = (val: string) => {
    const p = Math.max(0, Number(val));
    setDownPercent(p);
    setDownAmount(homePrice * (p / 100));
    setLastEdited('percent');
  };

  const handleAmountChange = (val: string) => {
    const a = Math.max(0, Number(val));
    setDownAmount(a);
    setDownPercent(homePrice > 0 ? (a / homePrice) * 100 : 0);
    setLastEdited('amount');
  };

  const result = useMemo(() => {
    const loanRemaining = Math.max(0, homePrice - downAmount);
    return { 
      loanRemaining, 
      isFullyFunded: downAmount >= homePrice,
      percentage: (downAmount / (homePrice || 1)) * 100
    };
  }, [homePrice, downAmount]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-muted-foreground">Home Price</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={homePrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="input-calc pl-9 text-lg font-medium text-primary"
                type="number"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Down Payment (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={downPercent.toFixed(2)}
                  onChange={(e) => handlePercentChange(e.target.value)}
                  className="input-calc pl-9"
                  type="number"
                  step="0.1"
                  min="0"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-muted-foreground">Down Payment ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={Math.round(downAmount)}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="input-calc pl-9"
                  type="number"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/20 p-5 rounded-2xl border border-border flex flex-col justify-center text-center">
          <Home className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Required Down Payment</h3>
          <div className="text-4xl font-bold gradient-text mb-6">
            ${Math.round(downAmount).toLocaleString()}
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm bg-background p-3 rounded-lg border border-border/50">
              <span className="text-muted-foreground">Loan Amount Remaining</span>
              <span className="font-semibold text-foreground">${Math.round(result.loanRemaining).toLocaleString()}</span>
            </div>
            
            <div className="flex items-center gap-2 mt-4 text-sm text-center justify-center">
              <PieChart className="w-4 h-4 text-primary" /> 
              <span><strong className="text-primary">{result.percentage.toFixed(1)}%</strong> of home funded</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
