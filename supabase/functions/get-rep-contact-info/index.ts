import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const requestSchema = z.object({
  repId: z.string().uuid(),
});

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate request
    const { repId } = requestSchema.parse(await req.json());
    console.log("Fetching contact info for repId:", repId);

    // Create Supabase client with service role (bypasses RLS)
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch only non-sensitive contact info
    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("phone_number, email")
      .eq("user_id", repId)
      .single();

    if (settingsError || !settings) {
      console.error("Settings not found for repId");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Contact information not found",
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        phoneNumber: settings.phone_number,
        email: settings.email,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in get-rep-contact-info:", error instanceof Error ? error.message : "Unknown error");
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request data",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch contact information",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
