import { PlayerLeadForm } from "@/components/PlayerLeadForm";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface FormSectionProps {
  repId?: string;
}

export const FormSection = ({ repId }: FormSectionProps) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("ajayyosi@venturesportsusa.com");

  useEffect(() => {
    const loadContactInfo = async () => {
      if (!repId) return;
      
      try {
        const { data, error } = await supabase.functions.invoke("get-rep-contact-info", {
          body: { repId },
        });

        if (!error && data?.success && data.email) {
          setEmail(data.email);
        }
      } catch (error) {
        console.error("Error loading contact info");
      }
    };

    loadContactInfo();
  }, [repId]);
  return (
    <section id="evaluation-form" className="relative py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Urgency banner */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-destructive/10 rounded-full border border-destructive/30">
              <span className="text-sm font-bold text-destructive">{t('form.urgency')}</span>
            </div>
          </div>
          
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm font-semibold text-primary">{t('form.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {t('form.title')}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-4">
              {t('form.subtitle')}
            </p>
            <p className="text-muted-foreground">
              {t('form.description')}
            </p>
          </div>

          <div className="bg-gradient-to-br from-card to-card/50 rounded-3xl border-2 border-border p-8 md:p-12 shadow-2xl">
            <PlayerLeadForm repId={repId} />
          </div>

          {/* Contact Info */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/5 via-accent-blue/5 to-primary/5 px-8 py-6 rounded-2xl border border-primary/20">
              <Mail className="w-6 h-6 text-primary" />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">{t('form.contactTitle')}</p>
                <a 
                  href={`mailto:${email}`}
                  className="text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
