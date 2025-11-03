import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const PIPEDRIVE_API_TOKEN = Deno.env.get("PIPEDRIVE_API_TOKEN");
const PIPEDRIVE_DOMAIN = "venturesportsusa";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const leadData: LeadData = await req.json();
    console.log("Received lead data:", leadData);

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
    console.log("Created person in Pipedrive:", personId);

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
    console.log("Created deal in Pipedrive:", dealId);

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
    console.error("Error in submit-lead function:", error);
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
