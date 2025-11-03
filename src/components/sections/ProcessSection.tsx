export const ProcessSection = () => {
  const steps = [
    {
      phase: "Step 1",
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
      color: "from-primary to-[hsl(220,70%,40%)]"
    },
    {
      phase: "Step 2",
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
      color: "from-accent-blue to-primary"
    },
    {
      phase: "Step 3",
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
      color: "from-[hsl(220,70%,40%)] to-primary"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            How Does It Work?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our proven 3-step process to get you from first contact to college commitment
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={step.phase}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-primary/30 to-transparent -z-10" />
              )}
              
              <div className="bg-card rounded-2xl border-2 border-border p-8 hover:border-primary transition-all hover:shadow-2xl h-full">
                <div className={`inline-block px-6 py-2 rounded-full bg-gradient-to-r ${step.color} text-white font-bold mb-4 text-sm`}>
                  {step.phase}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  {step.title}
                </h3>
                
                <ul className="space-y-3">
                  {step.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary font-bold flex-shrink-0 mt-1">→</span>
                      <span className="text-muted-foreground text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
