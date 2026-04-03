import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  onSelectCalculator: (categoryId: string, calcId: string) => void;
  initialQuery?: string;
}

export function SearchBar({ onSelectCalculator, initialQuery = '' }: SearchBarProps) {
  const { query, setQuery, results, isOpen, setIsOpen, close } = useSearch();
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      setIsOpen(true);
    }
  }, [initialQuery, setQuery, setIsOpen]);

  // Optional: Focus outline handling can be done here if needed.
  // The original component had an effect specifically for modal focus, which we don't strictly need now.

  const handleSelect = (categoryId: string, calcId: string) => {
    onSelectCalculator(categoryId, calcId);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={menuRef}>
      {/* Inline Search Input */}
      <div 
        className={`flex items-center gap-3 w-full px-4 py-3 bg-card/60 backdrop-blur-md rounded-xl border transition-all ${
          isOpen ? 'border-primary shadow-sm bg-card' : 'border-border/50 shadow-none'
        }`}
        onClick={() => setIsOpen(true)}
      >
        <Search className={`w-5 h-5 transition-colors ${isOpen || query ? 'text-primary' : 'text-muted-foreground'}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search 85+ calculators & converters..."
          className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-base"
          autoComplete="off"
        />
        
        {query ? (
          <button onClick={clearSearch} className="p-1 rounded-full hover:bg-secondary transition-colors">
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        ) : (
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-secondary text-xs font-medium text-muted-foreground">
            <Command className="w-3 h-3" />K
          </kbd>
        )}
      </div>

      {/* Dropdown Recommendations */}
      <AnimatePresence>
        {isOpen && query.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 w-full mt-2 z-50 bg-card/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="max-h-80 overflow-y-auto">
              {results.length > 0 ? (
                <ul className="p-2 grid gap-1">
                  {results.map((calc) => (
                    <li key={calc.id}>
                      <button
                        onClick={() => handleSelect(calc.categoryId, calc.id)}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 text-left transition-all border border-transparent hover:border-primary/20 group"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-foreground text-sm leading-tight mb-0.5">{calc.title}</span>
                          <span className="text-xs text-muted-foreground truncate">{calc.categoryTitle}</span>
                        </div>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                          calc.complexity === 'advanced' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-secondary text-muted-foreground'
                          }`}>
                          {calc.complexity}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm text-foreground font-medium">No matches for "{query}"</p>
                  <p className="text-xs text-muted-foreground mt-1">Try keywords like "mortgage", "bmi", or "discount".</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
