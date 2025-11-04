import { useLanguage } from "@/contexts/LanguageContext";

export const ValuesSection = () => {
  const { t } = useLanguage();
  
  const values = [
    {
      titleKey: "values.integrity.title",
      descriptionKey: "values.integrity.description",
      icon: "🎯"
    },
    {
      titleKey: "values.empathy.title",
      descriptionKey: "values.empathy.description",
      icon: "❤️"
    },
    {
      titleKey: "values.workEthic.title",
      descriptionKey: "values.workEthic.description",
      icon: "💪"
    },
    {
      titleKey: "values.results.title",
      descriptionKey: "values.results.description",
      icon: "⭐"
    }
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(59,130,246,0.05)_0%,_transparent_50%)]" />
      
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-sm font-semibold text-primary">{t('values.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            {t('values.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('values.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div 
              key={value.titleKey}
              className="group relative p-8 bg-gradient-to-br from-card to-card/50 rounded-3xl border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{value.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {t(value.titleKey)}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {t(value.descriptionKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
