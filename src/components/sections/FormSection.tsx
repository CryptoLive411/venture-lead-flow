import { PlayerLeadForm } from "@/components/PlayerLeadForm";
import { Sparkles } from "lucide-react";

export const FormSection = () => {
  return (
    <section id="evaluation-form" className="relative py-20 md:py-32 bg-gradient-to-b from-secondary/30 via-background to-[hsl(220,75%,15%)] overflow-hidden">
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container relative mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-4 px-6 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Begin Your Journey</span>
            </div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-accent-blue bg-clip-text text-transparent">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Complete this comprehensive evaluation to help us understand your athletic profile and career goals. Our team will review your application and contact you within 24 hours.
            </p>
          </div>

          <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-primary/20 hover:border-primary/40 transition-all">
            {/* Gradient border effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent-blue/10 rounded-3xl -z-10" />
            
            <PlayerLeadForm />
          </div>

          <div className="mt-12 text-center space-y-3 bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
            <p className="text-sm text-muted-foreground font-medium">
              Have questions about the application process?
            </p>
            <p className="text-base">
              <a
                href="mailto:nexusgloballc@gmail.com"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group"
              >
                Contact our team: nexusgloballc@gmail.com
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
