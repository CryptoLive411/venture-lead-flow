export const ValuesSection = () => {
  const values = [
    {
      title: "Integrity",
      description: "Our team is made up of former student-athletes who have gone through the experience of competing and studying abroad thanks to scholarships.",
      icon: "🎯"
    },
    {
      title: "Empathy",
      description: "We understand the journey because we've lived it. Every player receives personalized attention and support.",
      icon: "❤️"
    },
    {
      title: "Work-Ethic",
      description: "Direct contact with more than 400 universities. We work tirelessly to find the perfect fit for each athlete.",
      icon: "💪"
    },
    {
      title: "Results",
      description: "Focus on quality of service and accountability. Every player is an individual process with measurable outcomes.",
      icon: "⭐"
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Our Core Values
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built on the foundation of integrity, empathy, work-ethic, and proven results
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={value.title}
              className="group p-8 bg-card rounded-2xl border-2 border-border hover:border-primary transition-all hover:shadow-xl hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-5xl mb-4">{value.icon}</div>
              <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
