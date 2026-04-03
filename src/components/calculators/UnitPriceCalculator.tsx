import { useState, useMemo } from 'react';
import { ShoppingCart, Scale, ArrowRight, DollarSign } from 'lucide-react';

export function UnitPriceCalculator() {
  const [item1Params, setItem1Params] = useState({ price: '10', quantity: '500', unit: 'g' });
  const [item2Params, setItem2Params] = useState({ price: '18', quantity: '1000', unit: 'g' });
  const [compareMode, setCompareMode] = useState(true);

  const units = ['g', 'kg', 'ml', 'L', 'oz', 'lb', 'pieces'];

  const calculateUnit = (item: typeof item1Params) => {
    const p = Math.max(0, Number(item.price));
    const q = Math.max(0.0001, Number(item.quantity)); // prevent div zero
    return p / q;
  };

  const result = useMemo(() => {
    const unit1 = calculateUnit(item1Params);
    const unit2 = calculateUnit(item2Params);

    let winner = null;
    let savings = 0;

    if (compareMode) {
      if (unit1 < unit2) {
        winner = 1;
        savings = ((unit2 - unit1) / unit2) * 100;
      } else if (unit2 < unit1) {
        winner = 2;
        savings = ((unit1 - unit2) / unit1) * 100;
      } else {
        winner = 0; // exactly same
      }
    }

    return { unit1, unit2, winner, savings };
  }, [item1Params, item2Params, compareMode]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Unit Pricing</h3>
        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={compareMode}
            onChange={(e) => setCompareMode(e.target.checked)}
            className="rounded border-border text-primary focus:ring-primary"
          />
          Compare second item
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Item 1 */}
        <div className={`p-4 rounded-xl border transition-all ${result.winner === 1 ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
          <h4 className="flex items-center gap-2 font-medium mb-4 text-foreground">
            <ShoppingCart className="w-4 h-4 text-muted-foreground" /> Item {compareMode && "A"}
          </h4>
          
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={item1Params.price}
                  onChange={(e) => setItem1Params({ ...item1Params, price: e.target.value })}
                  className="input-calc pl-10 py-2 text-sm"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
                <input
                  value={item1Params.quantity}
                  onChange={(e) => setItem1Params({ ...item1Params, quantity: e.target.value })}
                  className="input-calc py-2 text-sm"
                  type="number"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Unit</label>
                <select
                  value={item1Params.unit}
                  onChange={(e) => setItem1Params({ ...item1Params, unit: e.target.value })}
                  className="input-calc py-2 text-sm"
                >
                  {units.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-border flex justify-between items-center">
              <span className="text-sm font-medium">Unit Price:</span>
              <span className="font-bold text-primary">${result.unit1.toFixed(4)} / {item1Params.unit}</span>
            </div>
          </div>
        </div>

        {/* Item 2 */}
        {compareMode && (
          <div className={`p-4 rounded-xl border transition-all ${result.winner === 2 ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
            <h4 className="flex items-center gap-2 font-medium mb-4 text-foreground">
              <ShoppingCart className="w-4 h-4 text-muted-foreground" /> Item B
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={item2Params.price}
                    onChange={(e) => setItem2Params({ ...item2Params, price: e.target.value })}
                    className="input-calc pl-10 py-2 text-sm"
                    type="number"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
                  <input
                    value={item2Params.quantity}
                    onChange={(e) => setItem2Params({ ...item2Params, quantity: e.target.value })}
                    className="input-calc py-2 text-sm"
                    type="number"
                    min="0"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Unit</label>
                  <select
                    value={item2Params.unit}
                    onChange={(e) => setItem2Params({ ...item2Params, unit: e.target.value })}
                    className="input-calc py-2 text-sm"
                  >
                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-border flex justify-between items-center">
                <span className="text-sm font-medium">Unit Price:</span>
                <span className="font-bold text-primary">${result.unit2.toFixed(4)} / {item2Params.unit}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {compareMode && (
        <div className="p-4 rounded-xl bg-secondary/30 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-card shadow-sm flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6 text-primary" />
          </div>
          <div>
            {result.winner === 0 ? (
              <p className="font-medium text-foreground">Both items have the exact same unit price.</p>
            ) : item1Params.unit !== item2Params.unit ? (
              <p className="font-medium text-warning">Warning: Units don't match, comparison may be inaccurate.</p>
            ) : (
              <>
                <p className="font-medium text-foreground">
                  Item {result.winner === 1 ? 'A' : 'B'} is the better deal!
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  It is <strong className="text-primary">{result.savings.toFixed(1)}%</strong> cheaper per {item1Params.unit}.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
