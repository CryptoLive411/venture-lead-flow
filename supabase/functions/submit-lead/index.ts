import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schema for incoming lead data
const leadSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phoneNumber: z.string().trim().min(10).max(20),
  currentClub: z.string().trim().max(100),
  age: z.string().trim().max(10),
  position: z.string().trim().max(50),
  nationality: z.string().trim().max(100),
  highschoolGPA: z.string().trim().max(20),
  highschoolGradYear: z.string().trim().max(10),
  visaAssistance: z.string().trim().max(10),
  estimatedBudget: z.string().trim().max(50),
  preferredLeague: z.array(z.string().max(100)).max(10),
  preferredDivision: z.array(z.string().max(50)).max(10),
  hasHighlightTape: z.string().trim().max(10),
  highlightsLink: z.string().trim().url().max(500).optional(),
  callAvailability: z.string().trim().max(100),
  repId: z.string().uuid(),
});

interface LeadData {
  fullName: string;
  email: string;
  phoneNumber: string;
  currentClub: string;
  age: string;
  position: string;
  nationality: string;
  highschoolGPA: string;
  highschoolGradYear: string;
  visaAssistance: string;
  estimatedBudget: string;
  preferredLeague: string[];
  preferredDivision: string[];
  hasHighlightTape: string;
  highlightsLink?: string;
  callAvailability: string;
  repId: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse and validate incoming data
    const rawData = await req.json();
    const leadData = leadSchema.parse(rawData);
    console.log("Lead submission received for repId:", leadData.repId);

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch sales rep settings with their Pipedrive credentials
    const { data: settings, error: settingsError } = await supabase
      .from("user_settings")
      .select("pipedrive_api_token, pipedrive_domain")
      .eq("user_id", leadData.repId)
      .single();

    if (settingsError || !settings) {
      console.error("Settings error:", settingsError);
      throw new Error("Sales representative settings not found.");
    }

    if (!settings.pipedrive_api_token || !settings.pipedrive_domain) {
      throw new Error("Sales representative Pipedrive credentials not configured.");
    }

    const PIPEDRIVE_API_TOKEN = settings.pipedrive_api_token;
    const PIPEDRIVE_DOMAIN = settings.pipedrive_domain;

    // Step 1: Create Person in Pipedrive
    const personResponse = await fetch(
      `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/persons?api_token=${PIPEDRIVE_API_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: leadData.fullName,
          email: [{ value: leadData.email, primary: true }],
          phone: [{ value: leadData.phoneNumber, primary: true }],
        }),
      }
    );

    if (!personResponse.ok) {
      const errorText = await personResponse.text();
      console.error("Failed to create person in Pipedrive:", errorText);
      throw new Error(`Pipedrive person creation failed: ${errorText}`);
    }

    const personData = await personResponse.json();
    const personId = personData.data.id;
    console.log("Created person in Pipedrive");

    // Step 2: Create Deal in Pipedrive with detailed notes
    const dealTitle = `${leadData.fullName} - College Soccer Application`;
    
    // Format the deal notes with all the form details
    const dealNotes = `
**Player Information:**
- Name: ${leadData.fullName}
- Email: ${leadData.email}
- Phone: ${leadData.phoneNumber}
- Age: ${leadData.age}
- Position: ${leadData.position}
- Current Club: ${leadData.currentClub}
- Nationality: ${leadData.nationality}

**Academic Information:**
- High School GPA: ${leadData.highschoolGPA}
- Graduation Year: ${leadData.highschoolGradYear}

**College Preferences:**
- Preferred Leagues: ${leadData.preferredLeague.join(", ")}
- Preferred Divisions: ${leadData.preferredDivision.join(", ")}
- Estimated Budget: ${leadData.estimatedBudget}

**Additional Information:**
- Needs Visa Assistance: ${leadData.visaAssistance}
- Has Highlight Tape: ${leadData.hasHighlightTape}
${leadData.highlightsLink ? `- Highlights Link: ${leadData.highlightsLink}` : ""}
- Available for Call: ${leadData.callAvailability}
    `.trim();

    const dealResponse = await fetch(
      `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/deals?api_token=${PIPEDRIVE_API_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: dealTitle,
          person_id: personId,
          value: leadData.estimatedBudget.replace(/[^0-9]/g, "") || "0", // Extract numeric value
          currency: "USD",
          visible_to: "3", // Visible to entire company
        }),
      }
    );

    if (!dealResponse.ok) {
      const errorText = await dealResponse.text();
      console.error("Failed to create deal in Pipedrive:", errorText);
      throw new Error(`Pipedrive deal creation failed: ${errorText}`);
    }

    const dealData = await dealResponse.json();
    const dealId = dealData.data.id;
    console.log("Created deal in Pipedrive");

    // Step 3: Add notes to the deal
    const noteResponse = await fetch(
      `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/notes?api_token=${PIPEDRIVE_API_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: dealNotes,
          deal_id: dealId,
          pinned_to_deal_flag: 1, // Pin the note
        }),
      }
    );

    if (!noteResponse.ok) {
      console.error("Failed to add note, but deal was created successfully");
    } else {
      console.log("Added detailed notes to deal");
    }

    // Step 4: Create an activity for the scheduled call
    const activityResponse = await fetch(
      `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/activities?api_token=${PIPEDRIVE_API_TOKEN}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: `Call with ${leadData.fullName}`,
          type: "call",
          due_date: leadData.callAvailability,
          due_time: "10:00", // Default time, can be customized
          duration: "00:30", // 30 minutes default
          deal_id: dealId,
          person_id: personId,
          note: `Scheduled call with ${leadData.fullName} - ${leadData.phoneNumber}`,
        }),
      }
    );

    if (!activityResponse.ok) {
      console.error("Failed to create activity, but deal was created successfully");
    } else {
      console.log("Created activity in Pipedrive");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Lead submitted successfully to Pipedrive",
        personId,
        dealId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in submit-lead function:", error instanceof Error ? error.message : "Unknown error");
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid form data",
          details: error.errors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : "Failed to submit lead to Pipedrive";
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
