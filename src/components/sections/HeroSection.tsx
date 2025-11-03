import { Button } from "@/components/ui/button";
import ventureLogoImage from "@/assets/venture-logo.png";
import heroImage from "@/assets/hero-ivy-league.png";

export const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById('evaluation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-[hsl(220,70%,25%)] to-[hsl(220,75%,35%)]">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent-blue/20 via-transparent to-transparent" />
      
      {/* Hero Image Background */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="Venture Athletes" 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="mb-8 flex justify-center">
            <img 
              src={ventureLogoImage} 
              alt="Venture Sports USA" 
              className="h-24 md:h-32 lg:h-40 w-auto drop-shadow-2xl"
            />
          </div>
          
          <h1 className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-8xl leading-tight">
            College Soccer<br/>
            <span className="text-accent-blue">Placement Consulting</span>
          </h1>
          
          <p className="mb-8 text-xl text-white/90 md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Founded in Florida with the goal of helping student-athletes from all over the world obtain an international education with a soccer scholarship
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center mb-12">
            <div className="flex flex-col items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-accent-blue">400+</div>
              <div className="text-white/80 text-sm">Universities</div>
            </div>
            <div className="flex flex-col items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-accent-blue">100+</div>
              <div className="text-white/80 text-sm">Players Placed</div>
            </div>
            <div className="flex flex-col items-center gap-2 px-6 py-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-accent-blue">24hrs</div>
              <div className="text-white/80 text-sm">Response Time</div>
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={scrollToForm}
            className="bg-accent-blue hover:bg-accent-blue/90 text-white text-lg px-8 py-6 h-auto rounded-full shadow-2xl hover:scale-105 transition-transform"
          >
            Start Your Journey
          </Button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-white/40 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};
