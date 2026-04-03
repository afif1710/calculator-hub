import { useState, useMemo } from 'react';
import { Receipt, Percent, Calculator as CalcIcon } from 'lucide-react';

export function SalesTaxCalculator() {
  const [amount, setAmount] = useState(100);
  const [taxRate, setTaxRate] = useState(5);
  const [quantity, setQuantity] = useState(1);
  const [mode, setMode] = useState<'add' | 'extract'>('add');

  const result = useMemo(() => {
    const a = Math.max(0, Number(amount));
    const t = Math.max(0, Number(taxRate));
    const q = Math.max(1, Number(quantity));

    const totalBaseAmount = a * q;
    let taxAmount = 0;
    let finalTotal = 0;
    let subtotal = 0;

    if (mode === 'add') {
      subtotal = totalBaseAmount;
      taxAmount = totalBaseAmount * (t / 100);
      finalTotal = subtotal + taxAmount;
    } else {
      finalTotal = totalBaseAmount;
      subtotal = finalTotal / (1 + (t / 100));
      taxAmount = finalTotal - subtotal;
    }

    const effectivePerItem = finalTotal / q;

    return { taxAmount, finalTotal, subtotal, effectivePerItem };
  }, [amount, taxRate, quantity, mode]);

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex bg-secondary/50 p-1 rounded-xl">
        <button
          onClick={() => setMode('add')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'add' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Add Tax (Exclusive)
        </button>
        <button
          onClick={() => setMode('extract')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            mode === 'extract' ? 'bg-primary text-primary-foreground shadow' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Extract Tax (Inclusive)
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Price/Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input-calc pl-8"
              type="number"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Quantity</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">×</span>
            <input
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input-calc pl-8"
              type="number"
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted-foreground">Tax Rate (%)</label>
        <div className="relative">
          <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="input-calc pl-10"
            type="number"
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-secondary/30 space-y-4 border border-border/50">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Subtotal</div>
            <div className="text-xl font-semibold">${result.subtotal.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Tax Amount</div>
            <div className="text-xl font-semibold text-destructive">${result.taxAmount.toFixed(2)}</div>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Final Total</div>
              <div className="text-3xl font-bold gradient-text">${result.finalTotal.toFixed(2)}</div>
            </div>
          </div>
          
          {quantity > 1 && (
            <div className="mt-3 text-sm text-muted-foreground flex items-center gap-1.5">
              <CalcIcon className="w-4 h-4" />
              Effective cost per item: <strong className="text-foreground">${result.effectivePerItem.toFixed(2)}</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
