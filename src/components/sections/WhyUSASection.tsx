import { CheckCircle2, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhyUSASection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,_rgba(239,68,68,0.04)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,_rgba(59,130,246,0.06)_0%,_transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('whyUSA.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('whyUSA.subtitle')}
          </p>
          <div className="mt-8 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Difficulties at Home */}
          <div className="relative bg-gradient-to-br from-destructive/5 via-destructive/3 to-transparent rounded-3xl p-8 border-2 border-destructive/20 shadow-xl shadow-destructive/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full blur-3xl" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              {t('whyUSA.difficulties')}
            </h3>
            <ul className="space-y-3">
              {t('whyUSA.difficultyList').split('|||').map((difficulty: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground group">
                  <XCircle className="text-destructive/70 mt-0.5 flex-shrink-0 w-5 h-5 group-hover:text-destructive transition-colors" />
                  <span className="text-sm md:text-base group-hover:text-foreground transition-colors">{difficulty}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advantages in USA */}
          <div className="relative bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-3xl p-8 border-2 border-primary/30 shadow-xl shadow-primary/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="text-3xl">🇺🇸</span>
              {t('whyUSA.advantages')}
            </h3>
            <ul className="space-y-3">
              {t('whyUSA.advantageList').split('|||').map((advantage: string, index: number) => (
                <li key={index} className="flex items-start gap-3 group">
                  <CheckCircle2 className="text-primary mt-0.5 flex-shrink-0 w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-sm md:text-base text-foreground/80 group-hover:text-foreground transition-colors">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
