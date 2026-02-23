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
      {/* Decorative grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(59,130,246,0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(59,130,246,0.06)_0%,_transparent_50%)]" />
      
      {/* Floating decorative shapes */}
      <div className="absolute top-20 left-[10%] w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-[15%] w-56 h-56 bg-accent-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 shadow-lg shadow-primary/5">
            <span className="text-sm font-semibold text-primary">{t('values.badge')}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('values.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('values.subtitle')}
          </p>
          {/* Decorative line */}
          <div className="mt-8 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div 
              key={value.titleKey}
              className="group relative p-8 bg-gradient-to-br from-card via-card to-secondary/30 rounded-3xl border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-tr-3xl rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/10 to-accent-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <span className="text-4xl">{value.icon}</span>
                </div>
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
