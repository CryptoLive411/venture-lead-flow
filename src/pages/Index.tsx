import { useEffect, useState } from "react";
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
import { Auth } from "@/components/Auth";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">Loading...</p>
    </div>;
  }

  // Show auth form if not authenticated
  if (!isAuthenticated) {
    return <Auth />;
  }

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
