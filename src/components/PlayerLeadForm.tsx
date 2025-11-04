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
import { useLanguage } from "@/contexts/LanguageContext";

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
  callTime: z.string().optional(),
  timezone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PlayerLeadFormProps {
  repId?: string;
}

export const PlayerLeadForm = ({ repId }: PlayerLeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

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
      callTime: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log("Submitting lead form");

    try {
      if (!repId) {
        throw new Error("Invalid link. Please use the link provided by your sales representative.");
      }

      // Add user's timezone to the submission
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...values,
          timezone,
          repId,
        },
      });

      if (error) {
        console.error("Error submitting lead:", error.message);
        throw error;
      }

      console.log("Lead submitted successfully");

      toast({
        title: t('form.successTitle'),
        description: t('form.successMessage'),
      });

      form.reset();
    } catch (error) {
      console.error("Failed to submit lead:", error);
      toast({
        title: t('form.errorTitle'),
        description: error instanceof Error ? error.message : t('form.errorMessage'),
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
                <FormLabel>{t('form.fullName')} *</FormLabel>
                <FormControl>
                  <Input placeholder={t('form.fullNamePlaceholder')} {...field} />
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
                <FormLabel>{t('form.email')} *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t('form.emailPlaceholder')} {...field} />
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
                <FormLabel>{t('form.phone')} *</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder={t('form.phonePlaceholder')} {...field} />
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
                <FormLabel>{t('form.currentClub')} *</FormLabel>
                <FormControl>
                  <Input placeholder={t('form.currentClubPlaceholder')} {...field} />
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
                <FormLabel>{t('form.age')} *</FormLabel>
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
                <FormLabel>{t('form.position')} *</FormLabel>
                <FormControl>
                  <Input placeholder={t('form.positionPlaceholder')} {...field} />
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
                <FormLabel>{t('form.nationality')} *</FormLabel>
                <FormControl>
                  <Input placeholder={t('form.nationalityPlaceholder')} {...field} />
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
                <FormLabel>{t('form.gpa')} *</FormLabel>
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
                <FormLabel>{t('form.gradYear')} *</FormLabel>
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
                <FormLabel>{t('form.visaAssistance')} *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectOption')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="yes">{t('form.yes')}</SelectItem>
                    <SelectItem value="no">{t('form.no')}</SelectItem>
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
              <FormLabel>{t('form.budget')} *</FormLabel>
              <FormControl>
                <Input placeholder={t('form.budgetPlaceholder')} {...field} />
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
              <FormLabel>{t('form.preferredLeague')} *</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {t('form.leagueOptions').split('|||').map((league) => (
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
              <FormLabel>{t('form.preferredDivision')} *</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {t('form.divisionOptions').split('|||').map((division) => (
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
              <FormLabel>{t('form.hasHighlightTape')} *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('form.selectOption')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="yes">{t('form.yes')}</SelectItem>
                  <SelectItem value="no">{t('form.no')}</SelectItem>
                  <SelectItem value="almost">{t('form.almost')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("hasHighlightTape") === "yes" && (
          <FormField
            control={form.control}
            name="highlightsLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.highlightsLink')} *</FormLabel>
                <FormControl>
                  <Input 
                    type="url" 
                    placeholder="https://youtube.com/..." 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  {t('form.highlightsLinkDescription')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="callAvailability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.callAvailability')} *</FormLabel>
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
          
          <FormField
            control={form.control}
            name="callTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.callTime')}</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  {t('form.callTimeDescription')}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-base font-bold"
        >
          {isSubmitting ? t('form.submitting') : t('form.submit')}
        </Button>
      </form>
    </Form>
  );
};
