import { motion } from 'framer-motion';
import { Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const themeConfig = {
  dark: { icon: Moon, label: 'Dark', color: 'bg-slate-700' },
  light: { icon: Sun, label: 'Light', color: 'bg-amber-400' },
};

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const CurrentIcon = theme === 'dark' ? Moon : Sun;

  return (
    <>
      {/* Mobile/Tablet Single Toggle Button */}
      <button
        onClick={toggleTheme}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 hover:bg-secondary text-foreground transition-all duration-200 border border-transparent hover:border-border shadow-sm"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="w-5 h-5" />
      </button>

      {/* Desktop Full Switcher */}
      <div className="hidden md:flex items-center gap-1 p-1 rounded-lg bg-secondary/50 border border-border/40 shadow-sm">
        {(Object.keys(themeConfig) as Array<keyof typeof themeConfig>).map((t) => {
          const { icon: Icon, label } = themeConfig[t];
          const isActive = theme === t;

          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              title={`${label} theme`}
            >
              {isActive && (
                <motion.div
                  layoutId="theme-indicator"
                  className="absolute inset-0 bg-card rounded-md shadow-sm border border-border/50"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
