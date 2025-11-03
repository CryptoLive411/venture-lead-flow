import { CheckCircle2 } from "lucide-react";

export const WhyUSASection = () => {
  const advantages = [
    "Support by the college system to combine studies and high-level sports",
    "Financial aids through sports, academic and international scholarships",
    "Training in an environment where student-athletes are valued and supported",
    "Language: Achieve bilingual level in English",
    "Professional opportunities: Boost your career after studies",
    "Access to the most complete and advanced academic & sports facilities",
    "Academic prestige of universities demonstrated by world rankings",
    "International experience that increases personal, academic and professional growth",
    "Cultural integration in one of the most influential countries in the world"
  ];

  const difficulties = [
    "Non-supportive system for high-level student-athletes",
    "Lack of programs covering academic-university needs for athletes",
    "Difficulty combining training and competitions with classes",
    "Absence of university tutors to support student-athletes",
    "Insufficient scholarships and financial aid",
    "Low importance of university sports",
    "Academic and sports facilities far from each other",
    "Must choose between high level sport or university studies"
  ];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            Why the USA?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The American college system offers unparalleled opportunities for student-athletes to excel both academically and athletically
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
          {/* Difficulties at Home */}
          <div className="bg-destructive/5 rounded-2xl p-8 border-2 border-destructive/20">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              Difficulties at Home
            </h3>
            <ul className="space-y-3">
              {difficulties.map((difficulty, index) => (
                <li key={index} className="flex items-start gap-3 text-muted-foreground">
                  <span className="text-destructive mt-1 flex-shrink-0">✗</span>
                  <span className="text-sm md:text-base">{difficulty}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Advantages in USA */}
          <div className="bg-primary/5 rounded-2xl p-8 border-2 border-primary/30">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <span className="text-3xl">🇺🇸</span>
              Advantages in USA
            </h3>
            <ul className="space-y-3">
              {advantages.map((advantage, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-1 flex-shrink-0 w-5 h-5" />
                  <span className="text-sm md:text-base text-foreground">{advantage}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
