import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const CTABanner = () => {
  const { t } = useLanguage();

  const scrollToForm = () => {
    document.getElementById('evaluation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="py-10 bg-gradient-to-r from-primary/5 via-accent-blue/5 to-primary/5">
      <div className="container mx-auto px-4 text-center">
        <Button 
          size="lg" 
          onClick={scrollToForm}
          className="bg-gradient-to-r from-primary to-accent-blue hover:from-primary/90 hover:to-accent-blue/90 text-white font-bold px-10 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
        >
          {t('cta.applyNow')}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};
