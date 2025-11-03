import { PlayerLeadForm } from "@/components/PlayerLeadForm";
import ventureLogoImage from "@/assets/venture-logo.png";
import heroImage from "@/assets/hero-ivy-league.png";
import teamImage from "@/assets/team-year-1.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-accent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-glow/20 via-transparent to-transparent" />
        
        {/* Hero Image Background */}
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Venture Athletes" 
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2 items-center">
            <div className="text-center md:text-left animate-fade-in">
              <div className="mb-6 flex justify-center md:justify-start">
                <img 
                  src={ventureLogoImage} 
                  alt="Venture Logo" 
                  className="h-20 md:h-28 w-auto drop-shadow-2xl"
                />
              </div>
              
              <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl lg:text-7xl">
                Join Venture
              </h1>
              <p className="mb-6 text-lg text-white/90 md:text-xl lg:text-2xl">
                Take the next step in your athletic journey with America's premier sports representation agency
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-white/80 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent-bright" />
                  <span>NCAA Placements</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent-bright" />
                  <span>Professional Guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent-bright" />
                  <span>Success Stories</span>
                </div>
              </div>
            </div>
            
            <div className="hidden md:block animate-fade-in">
              <img 
                src={teamImage} 
                alt="Team of the Year" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-gradient-to-b from-background to-secondary/10 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <h2 className="mb-4 text-3xl font-bold text-foreground md:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VentureSportsUSA Player Evaluation Form
              </h2>
              <p className="text-muted-foreground text-lg">
                Complete this comprehensive evaluation to help us understand your athletic profile and career goals. Our team will review your application and contact you within 24 hours.
              </p>
            </div>

            <div className="rounded-xl bg-card p-6 shadow-2xl md:p-10 border-2 border-primary/20 backdrop-blur-sm">
              <PlayerLeadForm />
            </div>

            <div className="mt-8 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Have questions about the application process?
              </p>
              <p className="text-sm">
                <a
                  href="mailto:info@venturesports.com"
                  className="text-primary hover:text-primary-dark font-semibold transition-colors"
                >
                  Contact our team →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
