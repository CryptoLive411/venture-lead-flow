import { PlayerLeadForm } from "@/components/PlayerLeadForm";

export const FormSection = () => {
  return (
    <section id="evaluation-form" className="py-20 md:py-32 bg-gradient-to-b from-secondary/30 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete this comprehensive evaluation to help us understand your athletic profile and career goals. Our team will review your application and contact you within 24 hours.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-2xl border-2 border-primary/20">
            <PlayerLeadForm />
          </div>

          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Have questions about the application process?
            </p>
            <p className="text-sm">
              <a
                href="mailto:nexusgloballc@gmail.com"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Contact our team: nexusgloballc@gmail.com →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
