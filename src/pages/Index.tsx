import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Star, Clock } from "lucide-react";
import { categories, getAllCalculators } from "@/data/calculators";
import { SearchBar } from "@/components/SearchBar";
import { CalculatorModal } from "@/components/CalculatorModal";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { useUserPreferences } from "@/hooks/useUserPreferences";

const CATEGORY_IMAGES: Record<string, string> = {
  math: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80", 
  finance: "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=600&q=80",
  digital_marketing: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  real_estate: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
  business: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
  sustainability: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
  health: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
  developer: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  home_diy: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
  automotive: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80",
  hr_salary: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  photography: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80",
  statistics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  units: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
  time: "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=600&q=80",
  electrical: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80",
  everyday: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",
};

const SPECIFIC_CALC_IMAGES: Record<string, string> = {
  // Math & Academic
  basic_arithmetic: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=400&q=80",
  percentage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
  scientific: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80",
  fraction: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
  quadratic: "https://images.unsplash.com/photo-1543616991-75a2212607bb?auto=format&fit=crop&w=400&q=80",
  matrix: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=400&q=80",
  gpa: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80",
  final_grade: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",

  // Finance
  mortgage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80",
  down_payment: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&q=80",
  budget_planner: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=400&q=80",
  expense_tracker: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&q=80",
  savings_goal: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=400&q=80",
  retirement_planner: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=400&q=80",
  compound_interest: "https://images.unsplash.com/photo-1579621941651-6019675605d3?auto=format&fit=crop&w=400&q=80",
  sip: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80",
  cagr: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
  inflation: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=400&q=80",
  loan_amortization: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=400&q=80",
  debt_payoff: "https://images.unsplash.com/photo-1589758438368-0ad531db3366?auto=format&fit=crop&w=400&q=80",

  // Real Estate
  rent_vs_buy: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80",
  // Business & Marketing
  pricing: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&w=400&q=80",
  profit_margin: "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=400&q=80",
  inventory_turnover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80",
  reorder_point: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=400&q=80",
  engagement_rate: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80",
  roas: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
  cac: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",

  // Health
  bmi_tdee: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80",
  water_intake: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=400&q=80",
  calories: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80",
  body_fat: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
  one_rep_max: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80",

  // Shopping & Everyday
  discount: "https://images.unsplash.com/photo-1556740734-754f46cb467b?auto=format&fit=crop&w=400&q=80",
  sales_tax: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
  unit_price: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
  tip_splitter: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=400&q=80",
  cooking: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=400&q=80",

  // Developer & Advanced
  json_csv: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80",
  subnet: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
  jwt_decoder: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80",
  cron: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=400&q=80",
  uuid: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=400&q=80",

  // Photography
  exposure: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80",
  dof: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?auto=format&fit=crop&w=400&q=80",
  print_size: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80",

  // HR & Salary
  take_home_pay: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
  salary_raise: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=400&q=80",

  // Home DIY
  paint: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=400&q=80",
  flooring: "https://images.unsplash.com/photo-1599083329062-814ae39f4175?auto=format&fit=crop&w=400&q=80",
  concrete: "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&w=400&q=80",

  // Automotive
  fuel_efficiency: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80",
  fuel: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=400&q=80",

  // Units & Time
  unit_converter: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=400&q=80",
  age: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=400&q=80",
  duration: "https://images.unsplash.com/photo-1501139083538-0139583c060f?auto=format&fit=crop&w=400&q=80",
  timezone: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=400&q=80",
};

const getCalcImage = (calcId: string, idx: number) => {
  if (SPECIFIC_CALC_IMAGES[calcId]) return SPECIFIC_CALC_IMAGES[calcId];
  const alternatives = [
    "https://images.unsplash.com/photo-1616077168079-7e09a677fb2c?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1600132806608-231446b2e7af?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1512314889357-e157c22f938d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1612548403247-aa2873e9422d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"
  ];
  return alternatives[idx % alternatives.length];
};

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedCalc, setSelectedCalc] = useState<{
    id: string;
    title: string;
    categoryId: string;
  } | null>(null);

  const { favorites, recentlyViewed } = useUserPreferences();
  const allCalculators = useMemo(() => getAllCalculators(), []);

  const favoriteCalculators = useMemo(() => {
    return favorites.map(id => allCalculators.find(c => c.id === id)).filter(Boolean) as typeof allCalculators;
  }, [favorites, allCalculators]);

  const recentCalculators = useMemo(() => {
    return recentlyViewed.map(id => allCalculators.find(c => c.id === id)).filter(Boolean) as typeof allCalculators;
  }, [recentlyViewed, allCalculators]);

  useEffect(() => {
    const calcParam = searchParams.get("calc");
    if (calcParam) {
      const calc = allCalculators.find((c) => c.id === calcParam);
      if (calc) {
        setSelectedCalc({ id: calc.id, title: calc.title, categoryId: calc.categoryId });
        setExpandedCategory(calc.categoryId); // Also set background niche
      }
    }
  }, [allCalculators, searchParams]);

  const handleSelectCalculator = useCallback((categoryId: string, calcId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const calc = category?.calculators.find((c) => c.id === calcId);
    if (calc) {
      setSelectedCalc({ id: calcId, title: calc.title, categoryId });
      setExpandedCategory(categoryId); // Take user into the niche
      setSearchParams({ calc: calcId });
    }
  }, [setSearchParams]);

  const handleCloseModal = useCallback(() => {
    setSelectedCalc(null);
    setSearchParams({});
  }, [setSearchParams]);

  // ── Favourites Screen ─────────────────────────────────────────────────────
  if (showFavorites) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden transition-colors duration-300">
        <div aria-hidden="true" className="absolute top-0 left-0 w-full h-[35vh] z-0 overflow-hidden bg-primary/20 dark:bg-card/50">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-full bg-secondary/30 dark:bg-background/20 rounded-b-[50%_30%]"></div>
        </div>
        <header className="pt-14 pb-4 px-6 text-center z-10 relative">
          <button
            onClick={() => setShowFavorites(false)}
            className="absolute left-4 top-4 flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground text-foreground/80 transition-all duration-200 shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="absolute right-4 top-4">
            <ThemeSwitcher />
          </div>
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h1 className="font-serif text-2xl md:text-3xl text-foreground leading-tight">My Favourites</h1>
          </div>
          <p className="font-serif text-sm text-foreground/60">
            {favoriteCalculators.length} saved tool{favoriteCalculators.length !== 1 ? 's' : ''}
          </p>
        </header>
        <main className="flex-grow flex flex-col relative z-10 px-3 pb-20">
          {favoriteCalculators.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-grow gap-4 text-center px-8 py-16">
              <Star className="w-16 h-16 text-muted-foreground/20" />
              <p className="font-serif text-lg text-muted-foreground">No favourites yet</p>
              <p className="text-sm text-muted-foreground/70 leading-relaxed">
                Open any calculator and tap the <strong>★ star icon</strong> in the top-right corner of the calculator to save it here.
              </p>
            </div>
          ) : (
            <div className="bg-card/95 backdrop-blur-sm rounded-[24px] p-3 shadow-sm flex-grow border border-border/50">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {favoriteCalculators.map((calc, idx) => (
                  <article
                    key={calc.id}
                    onClick={() => handleSelectCalculator(calc.categoryId, calc.id)}
                    className="relative rounded-[16px] overflow-hidden aspect-[4/5] shadow-sm flex flex-col justify-end group cursor-pointer border border-border/10 hover:border-primary/40 transition-all"
                  >
                    <img 
                      src={getCalcImage(calc.id, idx)} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = CATEGORY_IMAGES.everyday;
                        target.onerror = null;
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-100" 
                      alt={calc.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="relative p-3 text-white z-10 text-left">
                      <h2 className="font-serif text-sm md:text-base leading-tight mb-0.5 font-bold line-clamp-1">{calc.title}</h2>
                      <p className="font-serif text-[0.75rem] opacity-90 line-clamp-2">{calc.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </main>
        <CalculatorModal isOpen={!!selectedCalc} onClose={handleCloseModal} calculatorId={selectedCalc?.id ?? null} calculatorTitle={selectedCalc?.title ?? ""} />
      </div>
    );
  }

  // ── Expanded Category Screen ──────────────────────────────────────────────
  if (expandedCategory) {
    const currentCategory = categories.find(c => c.id === expandedCategory);
    if (currentCategory) {
      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden transition-colors duration-300">
          <div aria-hidden="true" className="absolute top-0 left-0 w-full h-[35vh] z-0 overflow-hidden bg-primary/20 dark:bg-card/50">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-full bg-secondary/30 dark:bg-background/20 rounded-b-[50%_30%]"></div>
          </div>
          <header className="pt-14 pb-4 px-6 text-center z-10 relative">
            <button onClick={() => setExpandedCategory(null)} className="absolute left-4 top-4 flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 hover:bg-primary hover:text-primary-foreground text-foreground/80 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-x-1">
              <ArrowLeft size={20} />
            </button>
            <div className="absolute right-4 top-4">
              <ThemeSwitcher />
            </div>
            <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-1 leading-tight px-8">{currentCategory.title}</h1>
            <p className="font-serif text-sm md:text-base text-foreground/70 leading-snug max-w-sm mx-auto px-4">{currentCategory.description}</p>
          </header>
          <main className="flex-grow flex flex-col relative z-10 px-3 pb-20">
            <div className="bg-card/95 backdrop-blur-sm rounded-[24px] p-3 shadow-sm flex-grow border border-border/50">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {currentCategory.calculators.map((calc, idx) => (
                  <article key={calc.id} onClick={() => handleSelectCalculator(currentCategory.id, calc.id)} className="relative rounded-[16px] overflow-hidden aspect-[4/5] shadow-sm flex flex-col justify-end group cursor-pointer border border-border/10 hover:border-primary/40 transition-all">
                    <img 
                      src={getCalcImage(calc.id, idx)} 
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = CATEGORY_IMAGES.everyday;
                        target.onerror = null;
                      }}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-100" 
                      alt={calc.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    <div className="relative p-3 text-white z-10 text-left">
                      <h2 className="font-serif text-sm md:text-base leading-tight mb-0.5 font-bold line-clamp-1">{calc.title}</h2>
                      <p className="font-serif text-[0.75rem] md:text-[0.85rem] opacity-90 line-clamp-2">{calc.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </main>
          <CalculatorModal isOpen={!!selectedCalc} onClose={handleCloseModal} calculatorId={selectedCalc?.id ?? null} calculatorTitle={selectedCalc?.title ?? ""} />
        </div>
      );
    }
  }

  // ── Home Screen ───────────────────────────────────────────────────────────
  const mainCategory = categories[0];
  const gridCategories = categories.slice(1);

  return (
    <div className="min-h-screen bg-background relative pb-8 font-sans transition-colors duration-300">
      <svg className="fixed top-[15%] left-0 w-full h-[600px] z-[-1] opacity-40" fill="none" preserveAspectRatio="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 20 Q50 60 100 20 L100 100 L0 100 Z" fill="currentColor" className="text-secondary dark:text-card"></path>
      </svg>

      <header className="pt-14 pb-4 px-6 text-center z-10 relative">
        {/* Favourites button — top left */}
        <button
          onClick={() => setShowFavorites(true)}
          className="absolute left-4 top-4 flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 hover:bg-yellow-500/20 text-foreground/80 hover:text-yellow-500 transition-all duration-200 shadow-sm"
          aria-label="View favourites"
          title="My Favourites"
        >
          <Star className={`w-5 h-5 transition-colors ${favoriteCalculators.length > 0 ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </button>

        <div className="absolute right-4 top-4">
          <ThemeSwitcher />
        </div>
        <h1 className="font-serif text-[28px] leading-tight text-foreground mb-0.5">CalcHub Premium</h1>
        <h2 className="font-serif text-[16px] leading-tight text-foreground/70 tracking-wide subtitle-font uppercase">Sophisticated Analyst Edition</h2>
      </header>

      <main className="px-4 relative z-10 flex flex-col gap-4 max-w-6xl mx-auto">

        {/* Search Bar */}
        <div className="bg-card/60 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-border/40 relative z-50">
          <SearchBar onSelectCalculator={handleSelectCalculator} initialQuery={searchParams.get("search") || ""} />
        </div>

        {/* Recently Viewed — always visible, keeps space so niches don't overlap */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 shrink-0 bg-secondary/60 px-2.5 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="text-xs font-medium whitespace-nowrap text-foreground/80">Recent:</span>
          </div>
          {recentCalculators.length === 0 ? (
            <span className="text-xs text-muted-foreground/50 italic whitespace-nowrap pl-1">
              Open a calculator to start tracking
            </span>
          ) : (
            recentCalculators.slice(0, 4).map(calc => (
              <button
                key={calc.id}
                onClick={() => handleSelectCalculator(calc.categoryId, calc.id)}
                className="shrink-0 bg-card/80 backdrop-blur-sm border border-border/60 hover:border-primary/50 hover:bg-primary/5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
              >
                {calc.title}
              </button>
            ))
          )}
        </div>

        {/* Spotlight / Main Category */}
        <div className="relative w-full aspect-video rounded-[20px] overflow-hidden shadow-card group cursor-pointer" onClick={() => setExpandedCategory(mainCategory.id)}>
          <img src={CATEGORY_IMAGES[mainCategory.id] || CATEGORY_IMAGES.everyday} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={mainCategory.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-black/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full p-4 text-foreground dark:text-white flex flex-col justify-end h-full z-10">
            <span className="text-[10px] font-medium tracking-wide mb-1 uppercase opacity-80 font-sans">Spotlight Category</span>
            <h3 className="font-serif text-[24px] leading-tight mb-1">{mainCategory.title}</h3>
            <p className="text-xs opacity-90 mb-3 font-light line-clamp-1">{mainCategory.description}</p>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full py-2.5 rounded-lg font-medium text-xs transition-colors shadow-sm font-sans uppercase tracking-wider">
              Explore Spotlight
            </button>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {gridCategories.map(category => (
            <div key={category.id} onClick={() => setExpandedCategory(category.id)} className="relative w-full aspect-square rounded-[16px] overflow-hidden shadow-card cursor-pointer group border border-border/10 hover:border-primary/40 transition-all">
              <img 
                src={CATEGORY_IMAGES[category.id] || CATEGORY_IMAGES.everyday} 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = CATEGORY_IMAGES.time; // Neutral fallback
                  target.onerror = null;
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 dark:opacity-100" 
                alt={category.title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none transition-colors duration-500"></div>
              <div className="absolute bottom-0 left-0 w-full p-3 text-white z-10 text-center">
                <h4 className="font-serif text-sm md:text-base leading-tight mb-0.5 font-bold">{category.title}</h4>
                <span className="text-[10px] font-medium opacity-90 font-sans">Discover Tools</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <CalculatorModal isOpen={!!selectedCalc} onClose={handleCloseModal} calculatorId={selectedCalc?.id ?? null} calculatorTitle={selectedCalc?.title ?? ""} />
    </div>
  );
};

export default Index;
