export const ScholarshipsSection = () => {
  const scholarshipTypes = [
    {
      title: "Athletic Scholarship",
      icon: "⚽",
      factors: [
        "Athletic level",
        "Video Highlights Evaluation",
        "Association & division (NCAA, NAIA, NJCAA)",
        "Male or female athlete (Title IX)",
        "Direct budget from Soccer Program",
        "Coaches' positional needs"
      ]
    },
    {
      title: "Academic Scholarship",
      icon: "🎓",
      factors: [
        "Academic level & GPA",
        "SAT & Duolingo Exam scores",
        "GPA Official Evaluation",
        "University Academic Award",
        "Degree Evaluation (Grad)",
        "Credits Evaluated (Transfer)"
      ]
    },
    {
      title: "International Student",
      icon: "🌎",
      factors: [
        "Citizenship",
        "Country relationship with USA",
        "Few schools offer this",
        "Number of students per country",
        "Academic Acceptance",
        "University funding availability"
      ]
    }
  ];

  const divisions = [
    { name: "NCAA D1", type: "Sports & Academic Scholarships" },
    { name: "NCAA D2", type: "Sports & Academic Scholarships" },
    { name: "NCAA D3", type: "Academic Scholarships" },
    { name: "NAIA", type: "Sports & Academic Scholarships" },
    { name: "NJCAA D1", type: "Sports & Academic Scholarships" },
    { name: "NJCAA D2", type: "Sports & Academic Scholarships" },
    { name: "NJCAA D3", type: "Academic Scholarships" }
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Scholarships & Funding
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Multiple scholarship opportunities to make your college dream affordable
          </p>
        </div>

        {/* Scholarship Types */}
        <div className="grid md:grid-cols-3 gap-8 mb-16 max-w-7xl mx-auto">
          {scholarshipTypes.map((scholarship, index) => (
            <div 
              key={scholarship.title}
              className="bg-card rounded-2xl border-2 border-border p-8 hover:border-primary transition-all hover:shadow-xl"
            >
              <div className="text-5xl mb-4">{scholarship.icon}</div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {scholarship.title}
              </h3>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-primary mb-3">Depends on:</p>
                <ul className="space-y-2">
                  {scholarship.factors.map((factor, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Scholarship Coverage */}
        <div className="bg-primary/5 rounded-2xl p-8 border-2 border-primary/20 mb-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Scholarship Coverage</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl p-6">
              <h4 className="text-lg font-bold text-primary mb-3">Partial Scholarship</h4>
              <p className="text-sm text-muted-foreground">
                Covers part of tuition and a percentage of other expenses (books, room & board, medical insurance)
              </p>
            </div>
            <div className="bg-card rounded-xl p-6">
              <h4 className="text-lg font-bold text-primary mb-3">Full Scholarship</h4>
              <p className="text-sm text-muted-foreground">
                Covers total costs - tuition, books, room & board, medical insurance
              </p>
            </div>
          </div>
        </div>

        {/* Divisions */}
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-foreground mb-12 text-center">College System Divisions</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {divisions.map((division, index) => (
              <div 
                key={division.name}
                className="group relative bg-gradient-to-br from-card to-card/50 rounded-2xl p-6 border-2 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
              >
                {/* Decorative number */}
                <div className="absolute top-2 right-2 text-4xl font-bold text-primary/5">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <div className="relative">
                  <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/20 to-accent-blue/20 rounded-full mb-4">
                    <span className="font-bold text-primary text-lg">{division.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                    {division.type}
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
