import { HeroSection } from "@/components/sections/HeroSection";
import { Header } from "@/components/sections/Header";
import { ValuesSection } from "@/components/sections/ValuesSection";
import { WhyUSASection } from "@/components/sections/WhyUSASection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ScholarshipsSection } from "@/components/sections/ScholarshipsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PlayersSection } from "@/components/sections/PlayersSection";
import { FormSection } from "@/components/sections/FormSection";
import { CallSchedulerSection } from "@/components/sections/CallSchedulerSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ValuesSection />
      <WhyUSASection />
      <ProcessSection />
      <ScholarshipsSection />
      <TestimonialsSection />
      <PlayersSection />
      <CallSchedulerSection />
      <FormSection />
    </div>
  );
};

export default Index;
