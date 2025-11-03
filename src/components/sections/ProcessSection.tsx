export const ProcessSection = () => {
  const steps = [
    {
      phase: "Step 1",
      number: "01",
      title: "Get in Contact",
      items: [
        "Talk with a VENTURE representative",
        "Send your Highlight videos",
        "Send your School Documents",
        "Schedule a call with team & family",
        "Profile Analysis & Assessment",
        "Define goals and possibilities",
        "Commitment to a new adVENTURE"
      ],
      color: "from-primary via-accent-blue to-primary"
    },
    {
      phase: "Step 2",
      number: "02",
      title: "Start Recruitment",
      items: [
        "Create E-Profile & Highlight Video",
        "Organize personalized Google Drive",
        "Academic documents translation",
        "English Exams Preparation",
        "Profile sent to College Coaches",
        "Introduction with College Coaches",
        "Possible Campus visits",
        "College Commitment"
      ],
      color: "from-accent-blue via-[hsl(200,100%,60%)] to-accent-blue"
    },
    {
      phase: "Step 3",
      number: "03",
      title: "Logistics & Legal",
      items: [
        "University Academic Application",
        "NCAA/NAIA registration",
        "Official transcripts submission",
        "School Acceptance",
        "Bank Statement",
        "F1 Student Visa",
        "SEVIS & VISA Process",
        "Book Flights to USA"
      ],
      color: "from-[hsl(220,70%,40%)] via-primary to-[hsl(220,70%,40%)]"
    }
  ];

  return (
    <section className="relative py-20 md:py-32 bg-background overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 via-background to-secondary/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.05)_0%,_transparent_70%)]" />
      
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-sm font-semibold text-primary">Our Process</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            How Does It Work?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Our proven 3-step process to get you from first contact to college commitment
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.phase}
              className="relative group"
            >
              {/* Animated connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-24 left-full w-full h-0.5 -z-10">
                  <div className={`h-full bg-gradient-to-r ${step.color} opacity-30`} />
                </div>
              )}
              
              <div className="relative bg-gradient-to-br from-card to-card/50 rounded-3xl border-2 border-border p-8 lg:p-10 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 h-full">
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent-blue/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  {/* Large number background */}
                  <div className="absolute -top-4 -right-4 text-9xl font-bold text-primary/5 select-none">
                    {step.number}
                  </div>
                  
                  {/* Phase badge */}
                  <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${step.color} text-white font-bold mb-6 text-sm shadow-lg transform group-hover:scale-105 transition-transform`}>
                    {step.phase}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  
                  <ul className="space-y-4">
                    {step.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <div className="flex-shrink-0 mt-1 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent-blue flex items-center justify-center text-white text-xs font-bold shadow-md">
                          {i + 1}
                        </div>
                        <span className="text-muted-foreground text-sm leading-relaxed group-hover/item:text-foreground transition-colors">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
