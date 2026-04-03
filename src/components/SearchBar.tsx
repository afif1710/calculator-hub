import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  onSelectCalculator: (categoryId: string, calcId: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSelectCalculator, initialQuery = '' }: SearchBarProps) {
  const { query, setQuery, results, isOpen, setIsOpen, close } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setIsOpen(true);
    }
  }, [initialQuery, setQuery, setIsOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (categoryId: string, calcId: string) => {
    onSelectCalculator(categoryId, calcId);
    close();
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 w-full max-w-xl mx-auto px-4 py-3 rounded-xl glass border border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all group"
      >
        <Search className="w-5 h-5" />
        <span className="flex-1 text-left">Search calculators...</span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-xs font-medium">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col">
            {/* Backdrop for Desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 dark:bg-background/95 backdrop-blur-md hidden md:block"
              onClick={close}
            />
            
            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full h-full md:h-auto md:max-w-2xl md:mx-auto md:mt-24 md:rounded-2xl overflow-hidden bg-background dark:bg-card shadow-2xl flex flex-col"
            >
              <div className="flex items-center gap-3 px-4 py-4 md:py-5 border-b border-border bg-background dark:bg-card">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 89+ calculators..."
                  className="flex-1 bg-transparent border-none outline-none text-foreground text-lg md:text-xl font-medium placeholder:text-muted-foreground/60 p-0"
                />
                <button 
                  onClick={close} 
                  className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto bg-background/50 dark:bg-card/50">
                {results.length > 0 ? (
                  <div className="p-3 md:p-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-3 px-2">
                      Top Recommendations
                    </div>
                    <ul className="grid gap-1">
                      {results.map((calc, i) => (
                        <motion.li
                          key={calc.id}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <button
                            onClick={() => handleSelect(calc.categoryId, calc.id)}
                            className="w-full flex items-center gap-4 px-3 py-3.5 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 text-left transition-all border border-transparent hover:border-primary/20 group"
                          >
                            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground text-base leading-tight mb-0.5">{calc.title}</div>
                              <div className="text-xs text-muted-foreground truncate">{calc.categoryTitle} • {calc.description}</div>
                            </div>
                            <div className="flex items-center text-xs font-medium text-muted-foreground/60 px-2 py-1 rounded-md bg-secondary/50">
                              View Tool
                            </div>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ) : query ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">No matches for "{query}"</h3>
                    <p className="text-sm text-muted-foreground">Try searching for keywords like "mortgage", "unit", or "binary".</p>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Command className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">Search CalcHub</h3>
                    <p className="text-sm text-muted-foreground">Quickly find any of our 89+ analytical tools.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
