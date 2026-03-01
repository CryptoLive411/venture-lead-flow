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
  fullName: z.string().trim().max(500).default(""),
  email: z.string().trim().max(500).default(""),
  phoneNumber: z.string().trim().max(500).default(""),
  currentClub: z.string().trim().max(500).default(""),
  age: z.string().max(500).default(""),
  position: z.string().max(500).default(""),
  nationality: z.string().trim().max(500).default(""),
  highschoolGPA: z.string().max(500).default(""),
  highschoolGradYear: z.string().max(500).default(""),
  visaAssistance: z.string().max(500).default("no"),
  estimatedBudget: z.string().max(500).default(""),
  preferredLeague: z.array(z.string()).default([]),
  preferredDivision: z.array(z.string()).default([]),
  hasHighlightTape: z.string().max(500).default("no"),
  highlightsLink: z.string().optional(),
  callAvailability: z.string().max(500).default(""),
  callTime: z.string().optional(),
  timezone: z.string().optional(),
  playerImage: z.any().optional(),
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
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log("Submitting lead form");

    try {
      if (!repId) {
        throw new Error("Invalid link. Please use the link provided by your sales representative.");
      }

      let imageUrl = "";
      
      if (values.playerImage) {
        const fileName = `${Date.now()}-${values.playerImage.name}`;
        const { error: uploadError } = await supabase.storage
          .from('player-images')
          .upload(fileName, values.playerImage);

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('player-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...values,
          repId,
          playerImage: imageUrl,
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
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
                  <Input type="text" placeholder={t('form.emailPlaceholder')} {...field} />
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
                  <Input type="text" placeholder={t('form.phonePlaceholder')} {...field} />
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
                  <Input type="text" placeholder="18" {...field} />
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
            name="playerImage"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormLabel>{t('form.playerImage')}</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onChange(file);
                    }}
                    {...field}
                  />
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
                      type="text" 
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
                      type="text" 
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
                      type="text" 
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
