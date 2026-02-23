import { useLanguage } from "@/contexts/LanguageContext";

export const ScholarshipsSection = () => {
  const { t } = useLanguage();
  
  const scholarshipTypes = [
    {
      titleKey: "scholarships.athletic.title",
      icon: "⚽",
      factorsKey: "scholarships.athletic.factors",
      gradient: "from-primary/10 to-accent-blue/5",
    },
    {
      titleKey: "scholarships.academic.title",
      icon: "🎓",
      factorsKey: "scholarships.academic.factors",
      gradient: "from-accent-blue/10 to-primary/5",
    },
    {
      titleKey: "scholarships.international.title",
      icon: "🌎",
      factorsKey: "scholarships.international.factors",
      gradient: "from-primary/5 to-accent-blue/10",
    }
  ];

  const divisions = [
    { name: "NCAA D1", typeKey: "scholarships.divisions.types.sportsAndAcademic" },
    { name: "NCAA D2", typeKey: "scholarships.divisions.types.sportsAndAcademic" },
    { name: "NCAA D3", typeKey: "scholarships.divisions.types.academicOnly" },
    { name: "NAIA", typeKey: "scholarships.divisions.types.sportsAndAcademic" },
    { name: "NJCAA D1", typeKey: "scholarships.divisions.types.sportsAndAcademic" },
    { name: "NJCAA D2", typeKey: "scholarships.divisions.types.sportsAndAcademic" },
    { name: "NJCAA D3", typeKey: "scholarships.divisions.types.academicOnly" }
  ];

  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background to-secondary/30 overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(59,130,246,0.06)_0%,_transparent_40%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20 shadow-lg shadow-primary/5">
            <span className="text-sm font-semibold text-primary">💰 {t('scholarships.title')}</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('scholarships.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('scholarships.subtitle')}
          </p>
          <div className="mt-8 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
        </div>

        {/* Scholarship Types */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
          {scholarshipTypes.map((scholarship) => (
            <div 
              key={scholarship.titleKey}
              className={`group bg-gradient-to-br ${scholarship.gradient} rounded-3xl border-2 border-border p-8 hover:border-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-card to-secondary/50 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl">{scholarship.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {t(scholarship.titleKey)}
                </h3>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary mb-3">{t('scholarships.athletic.dependsOn')}</p>
                  <ul className="space-y-2">
                    {t(scholarship.factorsKey).split('|||').map((factor: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        <span className="text-primary mt-0.5">•</span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scholarship Coverage */}
        <div className="bg-gradient-to-br from-primary/5 via-accent-blue/3 to-primary/5 rounded-3xl p-8 md:p-10 border-2 border-primary/20 mb-16 max-w-4xl mx-auto shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent-blue/5 rounded-full blur-3xl" />
          <div className="relative">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{t('scholarships.coverage.title')}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-1">
                <h4 className="text-lg font-bold text-primary mb-3">{t('scholarships.coverage.partial.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('scholarships.coverage.partial.description')}
                </p>
              </div>
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg hover:shadow-xl hover:border-primary/30 transition-all hover:-translate-y-1">
                <h4 className="text-lg font-bold text-primary mb-3">{t('scholarships.coverage.full.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('scholarships.coverage.full.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divisions */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">{t('scholarships.divisions.title')}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {divisions.map((division, index) => (
              <div 
                key={division.name}
                className="group relative bg-gradient-to-br from-card via-card to-secondary/20 rounded-2xl p-6 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-2 right-2 text-4xl font-bold text-primary/5">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="relative">
                  <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/20 to-accent-blue/20 rounded-full mb-4 shadow-sm">
                    <span className="font-bold text-primary text-lg">{division.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                    {t(division.typeKey)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
