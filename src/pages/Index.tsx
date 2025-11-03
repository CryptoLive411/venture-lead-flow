import { PlayerLeadForm } from "@/components/PlayerLeadForm";
import ventureLogo from "@/assets/venture-logo.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-top duration-500">
              <img
                src={ventureLogo}
                alt="Venture Logo"
                className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl"
              />
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight animate-in fade-in slide-in-from-top duration-700 delay-100">
              Join Venture
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-top duration-700 delay-200">
              Take the next step in your athletic journey. Fill out the form below and our team will reach out to discuss opportunities.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom duration-500">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Start Your Application
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're looking for talented athletes who are passionate and committed. Complete the form below and we'll be in touch within 24-48 hours.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-100">
            <PlayerLeadForm />
          </div>

          <div className="text-center text-sm text-muted-foreground pt-8 animate-in fade-in duration-700 delay-200">
            <p>
              Questions? Email us at{" "}
              <a
                href="mailto:info@venture.com"
                className="text-primary hover:text-accent-blue transition-colors duration-200 font-semibold"
              >
                info@venture.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
