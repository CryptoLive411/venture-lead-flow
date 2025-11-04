import { Button } from "@/components/ui/button";
import ventureLogoImage from "@/assets/venture-logo-new.png";
import heroImage from "@/assets/hero-soccer-stadium.jpg";
import { ArrowRight, Trophy, Users, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { t } = useLanguage();
  const scrollToForm = () => {
    document.getElementById('evaluation-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,75%,25%)] via-[hsl(220,70%,20%)] to-[hsl(220,75%,15%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,_rgba(59,130,246,0.15)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(147,51,234,0.1)_0%,_transparent_50%)]" />
      </div>
      
      {/* Hero Image Background with better blend */}
      <div className="absolute inset-0 opacity-25">
        <img 
          src={heroImage} 
          alt="Venture Athletes" 
          className="h-full w-full object-cover mix-blend-overlay"
        />
      </div>
      
      {/* Animated particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent-blue/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo with enhanced glow effect */}
          <div className="mb-12 flex justify-center animate-fade-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-accent-blue/40 blur-3xl rounded-full group-hover:bg-accent-blue/60 transition-all duration-500" />
              <img 
                src={ventureLogoImage} 
                alt="Venture Sports USA" 
                className="relative h-32 md:h-40 lg:h-48 w-auto drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
          
          {/* Headline with gradient effect */}
          <h1 className="mb-8 text-5xl font-bold text-white md:text-7xl lg:text-8xl leading-tight animate-fade-in">
            <span className="block mb-2">{t('hero.title1')}</span>
            <span className="block bg-gradient-to-r from-accent-blue via-[hsl(200,100%,60%)] to-accent-blue bg-clip-text text-transparent animate-pulse">
              {t('hero.title2')}
            </span>
          </h1>
          
          <p className="mb-12 text-lg text-white/80 md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed animate-fade-in font-light">
            {t('hero.subtitle')}
          </p>
          
          {/* Enhanced stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12 animate-fade-in">
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-accent-blue/50 transition-all hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-accent-blue/20">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center gap-3">
                <Trophy className="w-8 h-8 text-accent-blue" />
                <div className="text-4xl font-bold text-white">400+</div>
                <div className="text-white/70 text-sm font-medium">{t('hero.partnerUniversities')}</div>
              </div>
            </div>
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-accent-blue/50 transition-all hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-accent-blue/20">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center gap-3">
                <Users className="w-8 h-8 text-accent-blue" />
                <div className="text-4xl font-bold text-white">350+</div>
                <div className="text-white/70 text-sm font-medium">{t('hero.athletesPlaced')}</div>
              </div>
            </div>
            <div className="group relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-accent-blue/50 transition-all hover:bg-white/10 hover:scale-105 hover:shadow-2xl hover:shadow-accent-blue/20">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center gap-3">
                <Star className="w-8 h-8 text-accent-blue" />
                <div className="text-4xl font-bold text-white">24hrs</div>
                <div className="text-white/70 text-sm font-medium">{t('hero.responseTime')}</div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA button */}
          <div className="animate-fade-in mb-20">
            <Button 
              size="lg" 
              onClick={scrollToForm}
              className="group bg-gradient-to-r from-accent-blue to-[hsl(210,100%,60%)] hover:from-accent-blue/90 hover:to-[hsl(210,100%,70%)] text-white text-lg px-10 py-7 h-auto rounded-full shadow-2xl shadow-accent-blue/50 hover:shadow-accent-blue/70 hover:scale-105 transition-all duration-300 font-semibold"
            >
              {t('hero.startJourney')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2 hover:border-accent-blue transition-colors">
            <div className="w-1.5 h-3 bg-accent-blue rounded-full animate-pulse"></div>
          </div>
          <span className="text-white/50 text-xs font-medium">{t('hero.scroll')}</span>
        </div>
      </div>
    </section>
  );
};
