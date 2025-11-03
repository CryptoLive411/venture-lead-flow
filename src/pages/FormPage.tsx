import { useEffect, useState } from "react";
import { useParams, useSearchParams, Navigate } from "react-router-dom";
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
import { supabase } from "@/integrations/supabase/client";

const FormPage = () => {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [repId, setRepId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRepId = async () => {
      try {
        // Check for ?rep= parameter first
        const repParam = searchParams.get("rep");
        if (repParam) {
          setRepId(repParam);
          setLoading(false);
          return;
        }

        // If using slug format (just the username)
        if (slug) {
          const { data, error } = await supabase
            .from("user_settings")
            .select("user_id")
            .eq("username", slug)
            .maybeSingle();

          if (error || !data) {
            console.error("Error finding user:", error);
            setLoading(false);
            return;
          }

          setRepId(data.user_id);
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
      <ValuesSection />
      <WhyUSASection />
      <ProcessSection />
      <ScholarshipsSection />
      <TestimonialsSection />
      <PlayersSection />
      <CallSchedulerSection repId={repId} />
      <FormSection repId={repId} />
    </div>
  );
};

export default FormPage;
