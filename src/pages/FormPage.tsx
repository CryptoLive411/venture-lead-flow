import { useEffect, useState } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
import { HeroSection } from "@/components/sections/HeroSection";
import { Header } from "@/components/sections/Header";
import { WhyUSASection } from "@/components/sections/WhyUSASection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PlayersSection } from "@/components/sections/PlayersSection";
import { FormSection } from "@/components/sections/FormSection";
import { CallSchedulerSection } from "@/components/sections/CallSchedulerSection";
import { CTABanner } from "@/components/sections/CTABanner";
import { WhoIsThisForSection } from "@/components/sections/WhoIsThisForSection";
import { supabase } from "@/integrations/supabase/client";

const FormPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [repId, setRepId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepId = async () => {
      try {
        const repParam = searchParams.get("rep");
        if (repParam) {
          setRepId(repParam);
          setLoading(false);
          return;
        }

        if (slug) {
          const { data, error } = await supabase
            .from("user_settings")
            .select("user_id, username, email, phone_number")
            .eq("username", slug)
            .maybeSingle();

          if (error) {
            console.error("Error finding user:", error);
            setLoading(false);
            return;
          }

          if (data) {
            setRepId(data.user_id);
          }
        }
      } catch (error) {
        console.error("Error loading rep ID:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRepId();
  }, [slug, searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!repId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header repId={repId} />
      <HeroSection />
      <CTABanner />
      <WhyUSASection />
      <CTABanner />
      <PlayersSection />
      <TestimonialsSection />
      <CTABanner />
      <WhoIsThisForSection />
      <CallSchedulerSection repId={repId} />
      <FormSection repId={repId} />
    </div>
  );
};

export default FormPage;
