import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { categories, getAllCalculators } from "@/data/calculators";
import { SearchBar } from "@/components/SearchBar";
import { CalculatorModal } from "@/components/CalculatorModal";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const CATEGORY_IMAGES: Record<string, string> = {
  math: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80", 
  finance: "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=600&q=80",
  digital_marketing: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  real_estate: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
  business: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80", // Architecture/business
  sustainability: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80",
  health: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
  developer: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  home_diy: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
  automotive: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600&q=80",
  hr_salary: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  photography: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=600&q=80", // Guaranteed fresh camera
  statistics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
  units: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80",
  time: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=600&q=80",
  electrical: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80",
  everyday: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=600&q=80",
};

const SPECIFIC_CALC_IMAGES: Record<string, string> = {
  // Math
  matrix: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80",
  scientific: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?auto=format&fit=crop&w=400&q=80",
  quadratic: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80",
  
  // Real Estate & Debt
  mortgage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=400&q=80",
  down_payment: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&q=80",
  mortgage_afford: "https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?auto=format&fit=crop&w=400&q=80",
  rent_vs_buy: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80",
  rental_yield: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=400&q=80",
  cap_rate: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80",
  loan_amortization: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
  debt_payoff: "https://images.unsplash.com/photo-1580514614214-4113ab11bcba?auto=format&fit=crop&w=400&q=80",

  // Finance Investments
  compound_interest: "https://images.unsplash.com/photo-1518458028785-8fbcd101ebb9?auto=format&fit=crop&w=400&q=80",
  currency: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&w=400&q=80",
  budget_planner: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=400&q=80",
  expense_tracker: "https://images.unsplash.com/photo-1633535978148-decf9a60ed11?auto=format&fit=crop&w=400&q=80",
  savings_goal: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=400&q=80",
  retirement_planner: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?auto=format&fit=crop&w=400&q=80",

  // Everyday
  discount: "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=400&q=80",
  sales_tax: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80",
  unit_price: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",

  // Business
  pricing: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=400&q=80",
  profit_margin: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
  inventory_turnover: "https://images.unsplash.com/photo-1586528116311-ad8ed7c663b0?auto=format&fit=crop&w=400&q=80",
  reorder_point: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=400&q=80",

  // Developer & Security
  json_csv: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
  subnet: "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&w=400&q=80",
  jwt_decoder: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80",

  // Health
  bmi_tdee: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80",
  water_intake: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=400&q=80",
  calories: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=400&q=80",
  body_fat: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80",
};

const getCalcImage = (calcId: string, idx: number) => {
  if (SPECIFIC_CALC_IMAGES[calcId]) return SPECIFIC_CALC_IMAGES[calcId];
  
  // Expanded generic fallbacks (over 10) so tools within a category don't all look identical
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
}

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCalc, setSelectedCalc] = useState<{
    id: string;
    title: string;
    categoryId: string;
  } | null>(null);

  const allCalculators = useMemo(() => getAllCalculators(), []);

  useEffect(() => {
    const calcParam = searchParams.get("calc");
    if (calcParam) {
      const calc = allCalculators.find((c) => c.id === calcParam);
      if (calc) {
        setSelectedCalc({ id: calc.id, title: calc.title, categoryId: calc.categoryId });
      }
    }
  }, [allCalculators, searchParams]);

  const handleSelectCalculator = useCallback((categoryId: string, calcId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const calc = category?.calculators.find((c) => c.id === calcId);
    if (calc) {
      setSelectedCalc({ id: calcId, title: calc.title, categoryId });
      setSearchParams({ calc: calcId });
    }
  }, [setSearchParams]);

  const handleCloseModal = useCallback(() => {
    setSelectedCalc(null);
    setSearchParams({});
  }, [setSearchParams]);

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
                      <img src={getCalcImage(calc.id, idx)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-100" alt={calc.title} />
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

  const mainCategory = categories[0];
  const gridCategories = categories.slice(1);

  return (
    <div className="min-h-screen bg-background relative pb-8 font-sans transition-colors duration-300">
      <svg className="fixed top-[15%] left-0 w-full h-[600px] z-[-1] opacity-40" fill="none" preserveAspectRatio="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 20 Q50 60 100 20 L100 100 L0 100 Z" fill="currentColor" className="text-secondary dark:text-card"></path>
      </svg>
      <header className="pt-14 pb-4 px-6 text-center z-10 relative">
        <div className="absolute right-4 top-4">
          <ThemeSwitcher />
        </div>
        <h1 className="font-serif text-[28px] leading-tight text-foreground mb-0.5">CalcHub Premium</h1>
        <h2 className="font-serif text-[16px] leading-tight text-foreground/70 tracking-wide subtitle-font uppercase">Sophisticated Analyst Edition</h2>
      </header>
      <main className="px-4 relative z-10 flex flex-col gap-3 max-w-6xl mx-auto">
        <div className="mb-2 bg-card/60 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-border/40">
          <SearchBar onSelectCalculator={handleSelectCalculator} initialQuery={searchParams.get("search") || ""} />
        </div>
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {gridCategories.map(category => (
            <div key={category.id} onClick={() => setExpandedCategory(category.id)} className="relative w-full aspect-square rounded-[16px] overflow-hidden shadow-card cursor-pointer group border border-border/10 hover:border-primary/40 transition-all">
              <img src={CATEGORY_IMAGES[category.id] || CATEGORY_IMAGES.everyday} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 dark:opacity-100" alt={category.title} />
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
