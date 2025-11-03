import { HeroSection } from "@/components/sections/HeroSection";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { WhyUSASection } from "@/components/sections/WhyUSASection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ScholarshipsSection } from "@/components/sections/ScholarshipsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PlayersSection } from "@/components/sections/PlayersSection";
import { FormSection } from "@/components/sections/FormSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <ValuesSection />
      <WhyUSASection />
      <ProcessSection />
      <ScholarshipsSection />
      <TestimonialsSection />
      <PlayersSection />
      <FormSection />
    </div>
  );
};

export default Index;
