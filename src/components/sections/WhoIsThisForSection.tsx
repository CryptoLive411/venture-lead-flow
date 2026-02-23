import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const WhoIsThisForSection = () => {
  const { t } = useLanguage();

  const scrollToForm = () => {
    document.getElementById('evaluation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.05)_0%,_transparent_60%)]" />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-sm font-semibold text-primary">🎯 {t('whoIsThisFor.badge')}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            {t('whoIsThisFor.title')}
          </h2>
          
          <div className="space-y-4 mb-8 text-left max-w-xl mx-auto">
            {t('whoIsThisFor.criteria').split('|||').map((item: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-foreground/80">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-primary/10 via-accent-blue/10 to-primary/10 rounded-2xl p-6 border border-primary/20 mb-8">
            <p className="text-foreground font-semibold text-lg mb-2">
              {t('whoIsThisFor.pricing')}
            </p>
            <p className="text-muted-foreground text-sm">
              {t('whoIsThisFor.pricingSubtext')}
            </p>
          </div>

          {/* Urgency */}
          <div className="flex items-center justify-center gap-2 mb-8 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold text-sm">{t('whoIsThisFor.urgency')}</span>
          </div>

          <Button 
            size="lg" 
            onClick={scrollToForm}
            className="bg-gradient-to-r from-primary to-accent-blue hover:from-primary/90 hover:to-accent-blue/90 text-white font-bold px-10 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            {t('whoIsThisFor.cta')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
