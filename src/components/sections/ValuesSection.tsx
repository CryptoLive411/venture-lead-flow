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
    <section className="relative py-20 md:py-32 bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,_rgba(59,130,246,0.05)_0%,_transparent_50%)]" />
      
      <div className="container relative mx-auto px-4">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-block mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
            <span className="text-sm font-semibold text-primary">Why Choose Venture</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Our Core Values
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Built on the foundation of integrity, empathy, work-ethic, and proven results
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {values.map((value, index) => (
            <div 
              key={value.title}
              className="group relative p-8 bg-gradient-to-br from-card to-card/50 rounded-3xl border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-500">{value.icon}</div>
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
