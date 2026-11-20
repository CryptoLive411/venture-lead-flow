import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schema for incoming lead data
const leadSchema = z.object({
  fullName: z.string().trim().max(500).default(""),
  email: z.string().trim().max(500).default(""),
  phoneNumber: z.string().trim().max(500).default(""),
  currentClub: z.string().trim().max(500).default(""),
  age: z.string().trim().max(500).default(""),
  position: z.string().trim().max(500).default(""),
  nationality: z.string().trim().max(500).default(""),
  highschoolGPA: z.string().trim().max(500).default(""),
  highschoolGradYear: z.string().trim().max(500).default(""),
  visaAssistance: z.string().trim().max(500).default(""),
  estimatedBudget: z.string().trim().max(500).default(""),
  preferredLeague: z.array(z.string().max(500)).default([]),
  preferredDivision: z.array(z.string().max(500)).default([]),
  hasHighlightTape: z.string().trim().max(500).default(""),
  highlightsLink: z.string().trim().max(1000).optional(),
  callAvailability: z.string().trim().max(500).default(""),
  callTime: z.string().trim().max(500).optional(),
  timezone: z.string().trim().max(500).optional(),
  playerImage: z.string().trim().max(1000).optional(),
  repId: z.string().max(500).default(""),
  // The player's Ryval account, created at the top of the form.
  ryvalUserId: z.string().uuid().optional().catch(undefined),
  highlightUploaded: z.boolean().optional().catch(undefined),
});

type PipedriveRequestParams = {
  domain: string;
  path: string;
  tokens: string[];
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
};

async function pipedriveRequestWithTokenFallback({
  domain,
  path,
  tokens,
  method = "POST",
  body,
}: PipedriveRequestParams): Promise<Response> {
  let lastErrorText = "Unknown Pipedrive error";

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const url = `https://${domain}.pipedrive.com/api/v1/${path}?api_token=${encodeURIComponent(token)}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (response.ok) {
      return response;
    }

    const errorText = await response.text();
    lastErrorText = errorText || lastErrorText;

    const shouldRetryWithFallback = response.status === 401 && i < tokens.length - 1;
    if (shouldRetryWithFallback) {
      console.warn(`Pipedrive auth failed for token #${i + 1}. Retrying with fallback token.`);
      continue;
    }

    throw new Error(`Pipedrive request failed (${path}): ${errorText}`);
  }

  throw new Error(`Pipedrive request failed (${path}): ${lastErrorText}`);
}

// Helper function to convert time between timezones
function convertTime(dateStr: string, timeStr: string, fromTz: string, toTz: string): string {
  try {
    // Parse the time
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Create a date object for the given date in the source timezone
    // We'll use a formatter to get the UTC offset
    const testDate = new Date(`${dateStr}T12:00:00Z`);
    
    // Get the offset for the source timezone on this date
    const sourceFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: fromTz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZoneName: 'shortOffset'
    });
    
    // Format a known UTC time to extract the offset
    const utcDate = new Date(`${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00Z`);
    const sourceStr = sourceFormatter.format(utcDate);
    
    // Now we need to work backwards - we have the local time and need to find UTC
    // The trick: create multiple test dates and see which one produces our desired local time
    let bestMatch = utcDate;
    let bestDiff = Infinity;
    
    // Try offsets from -12 to +14 hours
    for (let offsetHours = -12; offsetHours <= 14; offsetHours++) {
      const testUTC = new Date(Date.UTC(
        parseInt(dateStr.split('-')[0]),
        parseInt(dateStr.split('-')[1]) - 1,
        parseInt(dateStr.split('-')[2]),
        hours - offsetHours,
        minutes,
        0
      ));
      
      const testLocalParts = sourceFormatter.formatToParts(testUTC);
      const testHour = parseInt(testLocalParts.find(p => p.type === 'hour')?.value || '0');
      const testMinute = parseInt(testLocalParts.find(p => p.type === 'minute')?.value || '0');
      
      const diff = Math.abs((testHour * 60 + testMinute) - (hours * 60 + minutes));
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = testUTC;
      }
      
      if (diff === 0) break; // Perfect match found
    }
    
    // Now format this UTC time in the target timezone
    const targetFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: toTz,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    const targetParts = targetFormatter.formatToParts(bestMatch);
    const targetHour = targetParts.find(p => p.type === 'hour')?.value || '00';
    const targetMinute = targetParts.find(p => p.type === 'minute')?.value || '00';
    
    return `${targetHour}:${targetMinute}`;
  } catch (error) {
    console.error('Error converting time:', error);
    return timeStr; // Return original time on error
  }
}

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
  callTime?: string;
  timezone?: string;
  playerImage?: string;
  repId: string;
  ryvalUserId?: string;
  highlightUploaded?: boolean;
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
      .select("pipedrive_api_token, pipedrive_domain, timezone")
      .eq("user_id", leadData.repId)
      .single();

    if (settingsError || !settings) {
      console.error("Settings error:", settingsError);
      throw new Error("Sales representative settings not found.");
    }

    const repToken = settings.pipedrive_api_token?.trim() || "";
    const fallbackToken = (Deno.env.get("PIPEDRIVE_API_TOKEN") ?? "").trim();
    const PIPEDRIVE_TOKENS = Array.from(new Set([repToken, fallbackToken].filter(Boolean)));
    const PIPEDRIVE_DOMAIN = settings.pipedrive_domain?.trim();

    if (!PIPEDRIVE_DOMAIN || PIPEDRIVE_TOKENS.length === 0) {
      throw new Error("Sales representative Pipedrive credentials not configured.");
    }

    // Step 1: Create Person in Pipedrive
    const personResponse = await pipedriveRequestWithTokenFallback({
      domain: PIPEDRIVE_DOMAIN,
      path: "persons",
      tokens: PIPEDRIVE_TOKENS,
      body: {
        name: leadData.fullName,
        email: [{ value: leadData.email, primary: true }],
        phone: [{ value: leadData.phoneNumber, primary: true }],
      },
    });

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
${leadData.highlightUploaded ? "- Highlight Video: uploaded to the player's Ryval profile" : ""}
${leadData.playerImage ? `- Player Image: ${leadData.playerImage}` : ""}
- Available for Call: ${leadData.callAvailability}
${leadData.ryvalUserId ? `\n**Ryval Profile:** https://api.ryvalsports.app/p/${leadData.ryvalUserId}` : ""}
    `.trim();

    const dealResponse = await pipedriveRequestWithTokenFallback({
      domain: PIPEDRIVE_DOMAIN,
      path: "deals",
      tokens: PIPEDRIVE_TOKENS,
      body: {
        title: dealTitle,
        person_id: personId,
        value: 4495,
        currency: "USD",
        visible_to: "3", // Visible to entire company
      },
    });

    const dealData = await dealResponse.json();
    const dealId = dealData.data.id;
    console.log("Created deal in Pipedrive");

    // Step 3: Add notes to the deal
    try {
      await pipedriveRequestWithTokenFallback({
        domain: PIPEDRIVE_DOMAIN,
        path: "notes",
        tokens: PIPEDRIVE_TOKENS,
        body: {
          content: dealNotes,
          deal_id: dealId,
          pinned_to_deal_flag: 1, // Pin the note
        },
      });
      console.log("Added detailed notes to deal");
    } catch (error) {
      console.error("Failed to add note, but deal was created successfully", error);
    }

    // Step 4: Create an activity for the scheduled call
    // Convert time from user's timezone to sales rep's timezone
    let convertedTime = leadData.callTime || "10:00";
    let timezoneNote = "";
    
    if (leadData.callTime && leadData.timezone && settings.timezone) {
      try {
        const userTimezone = leadData.timezone;
        const repTimezone = settings.timezone;
        
        // Convert the time
        convertedTime = convertTime(
          leadData.callAvailability,
          leadData.callTime,
          userTimezone,
          repTimezone
        );
        
        timezoneNote = ` (converted from ${leadData.callTime} ${userTimezone} to ${convertedTime} ${repTimezone})`;
        console.log(`Time conversion: ${leadData.callTime} ${userTimezone} → ${convertedTime} ${repTimezone}`);
      } catch (error) {
        console.error("Error converting timezone:", error);
        convertedTime = leadData.callTime;
        timezoneNote = ` (${leadData.callTime} in ${leadData.timezone} - conversion failed)`;
      }
    } else {
      timezoneNote = leadData.timezone ? ` (${leadData.timezone} timezone)` : " (user's local time)";
    }
    
    try {
      await pipedriveRequestWithTokenFallback({
        domain: PIPEDRIVE_DOMAIN,
        path: "activities",
        tokens: PIPEDRIVE_TOKENS,
        body: {
          subject: `Call with ${leadData.fullName}`,
          type: "call",
          due_date: leadData.callAvailability,
          due_time: convertedTime,
          duration: "00:30", // 30 minutes default
          deal_id: dealId,
          person_id: personId,
          note: `Scheduled call with ${leadData.fullName} - ${leadData.phoneNumber}${leadData.callTime ? timezoneNote : ""}`,
        },
      });
      console.log("Created activity in Pipedrive");
    } catch (error) {
      console.error("Failed to create activity, but deal was created successfully", error);
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
