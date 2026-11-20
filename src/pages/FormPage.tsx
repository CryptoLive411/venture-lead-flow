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
          console.log("✅ FormPage: Found repId from query param:", repParam);
          setRepId(repParam);
          setLoading(false);
          return;
        }

        // If using slug format (just the username)
        if (slug) {
          console.log("🔍 FormPage: Looking up user by slug:", slug);
          // Only the rep's id comes back: user_settings is not readable from
          // the browser (it holds each rep's Pipedrive token).
          let { data: id, error } = await supabase.rpc("rep_id_for_username", {
            slug,
          });

          // Until migration 20261120030000 is applied the function does not
          // exist yet; the old table read still works then.
          if (error) {
            const old = await supabase
              .from("user_settings")
              .select("user_id")
              .eq("username", slug)
              .maybeSingle();
            id = old.data?.user_id ?? null;
            error = old.error ? error : null;
          }

          if (error) {
            console.error("❌ FormPage: Error finding user:", error);
            setLoading(false);
            return;
          }

          if (id) {
            console.log("✅ FormPage: Found rep for slug");
            setRepId(id);
          } else {
            console.log("⚠️ FormPage: No user found for slug:", slug);
          }
        }
      } catch (error) {
        console.error("❌ FormPage: Error loading rep ID:", error);
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
