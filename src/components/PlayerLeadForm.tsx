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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const formSchema = z.object({
  fullName: z.string().trim().max(100).default(""),
  email: z.string().trim().max(255).default(""),
  phoneNumber: z.string().trim().max(50).default(""),
  whatsappNumber: z.string().trim().max(50).default(""),
  currentClub: z.string().trim().max(100).default(""),
  age: z.string().max(20).default(""),
  position: z.string().max(100).default(""),
  nationality: z.string().trim().max(100).default(""),
  highschoolGPA: z.string().max(50).default(""),
  highschoolGradYear: z.string().max(20).default(""),
  visaAssistance: z.enum(["yes", "no"]).default("no"),
  budgetReady: z.enum(["yes", "payment_plan", "no"]).default("yes"),
  estimatedBudget: z.string().max(100).default(""),
  preferredLeague: z.array(z.string()).default([]),
  preferredDivision: z.array(z.string()).default([]),
  hasHighlightTape: z.enum(["yes", "no", "almost"]).default("no"),
  highlightsLink: z.string().optional(),
  timeline: z.enum(["asap", "3_6_months", "exploring"]).default("asap"),
  seriousness: z.enum(["very_serious", "somewhat", "curious"]).default("very_serious"),
  callAvailability: z.string().max(50).default(""),
  callTime: z.string().optional(),
  timezone: z.string().optional(),
  playerImage: z.instanceof(File).optional(),
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
      whatsappNumber: "",
      currentClub: "",
      age: "",
      position: "",
      nationality: "",
      highschoolGPA: "",
      highschoolGradYear: "",
      visaAssistance: "no",
      budgetReady: "yes",
      estimatedBudget: "",
      preferredLeague: [],
      preferredDivision: [],
      hasHighlightTape: "no",
      highlightsLink: "",
      timeline: "asap",
      seriousness: "very_serious",
      callAvailability: "",
      callTime: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

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
        throw error;
      }

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
        {/* Personal Info */}
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
            name="whatsappNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.whatsapp')} *</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder={t('form.whatsappPlaceholder')} {...field} />
                </FormControl>
                <FormDescription>{t('form.whatsappDescription')}</FormDescription>
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

        {/* Highlight Video - Required */}
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

        {(form.watch("hasHighlightTape") === "yes" || form.watch("hasHighlightTape") === "almost") && (
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

        {/* Qualifying Questions */}
        <div className="space-y-6 pt-4 border-t border-border">
          <h3 className="text-lg font-bold text-foreground">{t('form.qualifyingTitle')}</h3>

          {/* Budget */}
          <FormField
            control={form.control}
            name="budgetReady"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t('form.budgetReady')} *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="budget-yes" />
                      <Label htmlFor="budget-yes">{t('form.budgetYes')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="payment_plan" id="budget-plan" />
                      <Label htmlFor="budget-plan">{t('form.budgetPlan')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="budget-no" />
                      <Label htmlFor="budget-no">{t('form.budgetNo')}</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Timeline */}
          <FormField
            control={form.control}
            name="timeline"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t('form.timeline')} *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="asap" id="timeline-asap" />
                      <Label htmlFor="timeline-asap">{t('form.timelineASAP')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3_6_months" id="timeline-36" />
                      <Label htmlFor="timeline-36">{t('form.timeline36')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="exploring" id="timeline-exploring" />
                      <Label htmlFor="timeline-exploring">{t('form.timelineExploring')}</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Seriousness */}
          <FormField
            control={form.control}
            name="seriousness"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t('form.seriousness')} *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="very_serious" id="serious-very" />
                      <Label htmlFor="serious-very">{t('form.seriousVery')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="somewhat" id="serious-somewhat" />
                      <Label htmlFor="serious-somewhat">{t('form.seriousSomewhat')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="curious" id="serious-curious" />
                      <Label htmlFor="serious-curious">{t('form.seriousCurious')}</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Leagues & Divisions */}
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

        {/* Call scheduling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="callAvailability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('form.callAvailability')} *</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>{t('form.callTimeDescription')}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-14 text-lg font-bold bg-gradient-to-r from-primary to-accent-blue hover:from-primary/90 hover:to-accent-blue/90 text-white rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
        >
          {isSubmitting ? t('form.submitting') : t('form.submit')}
        </Button>
      </form>
    </Form>
  );
};
