import { HeroSection } from "@/components/sections/HeroSection";
import { Header } from "@/components/sections/Header";
import { WhyUSASection } from "@/components/sections/WhyUSASection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PlayersSection } from "@/components/sections/PlayersSection";
import { FormSection } from "@/components/sections/FormSection";
import { CallSchedulerSection } from "@/components/sections/CallSchedulerSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { WhoIsThisForSection } from "@/components/sections/WhoIsThisForSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <CTABanner />
      <WhyUSASection />
      <CTABanner />
      <PlayersSection />
      <TestimonialsSection />
      <CTABanner />
      <WhoIsThisForSection />
      <CallSchedulerSection />
      <FormSection />
    </div>
  );
};

export default Index;
