import { Button } from "@/components/ui/button";
import { Calendar, Phone, Clock, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface CallSchedulerSectionProps {
  repId?: string;
}

export const CallSchedulerSection = ({ repId }: CallSchedulerSectionProps) => {
  const { t } = useLanguage();
  const [contactInfo, setContactInfo] = useState<{
    phone_number: string | null;
    email: string | null;
  }>({
    phone_number: "5085891407",
    email: "ajayyosi@venturesportsusa.com",
  });

  useEffect(() => {
    const loadContactInfo = async () => {
      if (!repId) return;
      
      try {
        const { data, error } = await supabase.functions.invoke("get-rep-contact-info", {
          body: { repId },
        });

        if (!error && data?.success) {
          setContactInfo({
            phone_number: data.phoneNumber || "5085891407",
            email: data.email || "ajayyosi@venturesportsusa.com",
          });
        }
      } catch (error) {
        console.error("Error loading contact info");
      }
    };

    loadContactInfo();
  }, [repId]);
  
  const benefits = t('callScheduler.benefits').split('|||');

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background via-primary/5 to-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent-blue/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">{t('callScheduler.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              {t('callScheduler.title')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t('callScheduler.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left side - Benefits */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-card to-card/50 rounded-3xl p-8 border-2 border-border shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t('callScheduler.whatToExpect')}</h3>
                    <p className="text-sm text-muted-foreground">{t('callScheduler.inYourConsultation')}</p>
                  </div>
                </div>
                
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact info card */}
              <div className="bg-gradient-to-br from-primary/5 to-accent-blue/5 rounded-2xl p-6 border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-semibold text-foreground">{t('callScheduler.available')}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('callScheduler.hours')}
                </p>
              </div>
            </div>

            {/* Right side - Call buttons */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-card to-card/50 rounded-3xl p-8 md:p-10 border-2 border-primary/20 shadow-2xl hover:shadow-primary/20 transition-all">
                <div className="text-center space-y-6">
                  <div className="inline-block p-4 bg-gradient-to-br from-primary/10 to-accent-blue/10 rounded-2xl">
                    <Phone className="w-12 h-12 text-primary" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{t('callScheduler.callDirectly')}</h3>
                    <p className="text-muted-foreground mb-6">{t('callScheduler.speakNow')}</p>
                    
                    <a href={`tel:${contactInfo.phone_number}`}>
                      <Button 
                        size="lg"
                        className="w-full bg-gradient-to-r from-primary to-accent-blue hover:from-primary/90 hover:to-accent-blue/90 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      >
                        <Phone className="w-5 h-5 mr-2" />
                        {contactInfo.phone_number}
                      </Button>
                    </a>
                  </div>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-4 text-muted-foreground font-medium">{t('callScheduler.or')}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{t('callScheduler.emailUs')}</h3>
                    <p className="text-muted-foreground mb-6">{t('callScheduler.emailResponse')}</p>
                    
                    <a href={`mailto:${contactInfo.email}`}>
                      <Button 
                        size="lg"
                        variant="outline"
                        className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-6 rounded-xl transition-all hover:scale-105"
                      >
                        <Calendar className="w-5 h-5 mr-2" />
                        {contactInfo.email}
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
