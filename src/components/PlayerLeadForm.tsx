import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phoneNumber: z
    .string()
    .trim()
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20, { message: "Phone must be less than 20 characters" }),
  currentClub: z
    .string()
    .trim()
    .min(1, { message: "Current club is required" }),
  age: z
    .string()
    .min(1, { message: "Age is required" }),
  position: z
    .string()
    .min(1, { message: "Position is required" }),
  nationality: z
    .string()
    .trim()
    .min(1, { message: "Nationality is required" }),
  highschoolGPA: z
    .string()
    .min(1, { message: "Highschool GPA is required" }),
  highschoolGradYear: z
    .string()
    .min(4, { message: "Graduation year is required" }),
  visaAssistance: z.enum(["yes", "no"]),
  estimatedBudget: z
    .string()
    .min(1, { message: "Budget estimate is required" }),
  preferredLeague: z
    .array(z.string())
    .min(1, { message: "Select at least one league" }),
  preferredDivision: z
    .array(z.string())
    .min(1, { message: "Select at least one division" }),
  hasHighlightTape: z.enum(["yes", "no", "almost"]),
  highlightsLink: z.string().optional(),
  callAvailability: z
    .string()
    .min(1, { message: "Please select when you're available" }),
});

type FormValues = z.infer<typeof formSchema>;

interface PlayerLeadFormProps {
  repId?: string;
}

export const PlayerLeadForm = ({ repId }: PlayerLeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      currentClub: "",
      age: "",
      position: "",
      nationality: "",
      highschoolGPA: "",
      highschoolGradYear: "",
      visaAssistance: "no",
      estimatedBudget: "",
      preferredLeague: [],
      preferredDivision: [],
      hasHighlightTape: "no",
      highlightsLink: "",
      callAvailability: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log("Submitting lead to Pipedrive:", values);

    try {
      if (!repId) {
        throw new Error("Invalid link. Please use the link provided by your sales representative.");
      }

      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...values,
          repId,
        },
      });

      if (error) {
        console.error("Error submitting lead:", error);
        throw error;
      }

      console.log("Lead submitted successfully:", data);

      toast({
        title: "Success!",
        description: "Your application has been submitted. We'll contact you within 24 hours!",
      });

      form.reset();
    } catch (error) {
      console.error("Failed to submit lead:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name *</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number *</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentClub"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Club *</FormLabel>
                <FormControl>
                  <Input placeholder="Your current club" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age *</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="18" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Midfielder, Forward, Defender" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nationality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nationality *</FormLabel>
                <FormControl>
                  <Input placeholder="Your nationality" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highschoolGPA"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highschool GPA *</FormLabel>
                <FormControl>
                  <Input placeholder="3.5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="highschoolGradYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highschool Graduation Year *</FormLabel>
                <FormControl>
                  <Input placeholder="2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="visaAssistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Do you need Visa Assistance? *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="estimatedBudget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated College Yearly Budget *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., $50,000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredLeague"
          render={() => (
            <FormItem>
              <FormLabel>Preferred College League * (Select all that apply)</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["NCAA", "NAIA", "JUCO", "NJCAA", "Not Sure yet"].map((league) => (
                  <FormField
                    key={league}
                    control={form.control}
                    name="preferredLeague"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(league)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, league])
                                : field.onChange(field.value?.filter((value) => value !== league));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer text-sm">{league}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredDivision"
          render={() => (
            <FormItem>
              <FormLabel>Preferred College Division * (Select all that apply)</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "NCAA D1",
                  "NCAA D2",
                  "NCAA D3",
                  "NAIA D1-D3",
                  "NJCAA D1-D3",
                  "JUCO or Highschool Academy",
                  "Not sure yet"
                ].map((division) => (
                  <FormField
                    key={division}
                    control={form.control}
                    name="preferredDivision"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(division)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, division])
                                : field.onChange(field.value?.filter((value) => value !== division));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer text-sm">{division}</FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hasHighlightTape"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you have a highlight tape made? *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="almost">Almost</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highlightsLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attach Highlights Link (Optional)</FormLabel>
              <FormControl>
                <Input 
                  type="url" 
                  placeholder="https://youtube.com/..." 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Link to your highlight video (YouTube, Vimeo, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="callAvailability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>When are you free for a call? *</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-base font-bold"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </Form>
  );
};
