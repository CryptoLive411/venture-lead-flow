import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhyUSASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('whyUSA.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('whyUSA.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Difficulties at Home */}
          <div className="bg-destructive/5 rounded-2xl p-8 border-2 border-destructive/20">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              {t('whyUSA.difficulties')}
            </h3>
            <ul className="space-y-3">
              {t('whyUSA.difficultyList').split('|||').map((difficulty: string, index: number) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-destructive mt-1 flex-shrink-0">✗</span>
                  <span className="text-sm md:text-base">{difficulty}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advantages in USA */}
          <div className="bg-primary/5 rounded-2xl p-8 border-2 border-primary/30">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="text-3xl">🇺🇸</span>
              {t('whyUSA.advantages')}
            </h3>
            <ul className="space-y-3">
              {t('whyUSA.advantageList').split('|||').map((advantage: string, index: number) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0 w-5 h-5" />
                  <span className="text-sm md:text-base text-foreground">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
