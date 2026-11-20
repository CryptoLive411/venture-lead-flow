import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Lock, Upload, X } from "lucide-react";
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
import { fill } from "@/translations/account";
import { RyvalAccountStep } from "@/components/RyvalAccountStep";
import { LeadSuccess } from "@/components/LeadSuccess";
import {
  MAX_VIDEO_BYTES,
  POSITIONS,
  type RyvalSession,
  positionEnglish,
  profilePatch,
  updateProfile,
  uploadPhoto,
  uploadVideo,
} from "@/lib/ryval";

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

type Done = { firstName: string; email: string; warnings: string[] };

export const PlayerLeadForm = ({ repId }: PlayerLeadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState<RyvalSession | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [stage, setStage] = useState<string | null>(null);
  const [done, setDone] = useState<Done | null>(null);
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

  const positionLabels = t("account.positions").split("|||");

  const onAccount = (s: RyvalSession | null, fullName?: string) => {
    setSession(s);
    form.setValue("email", s?.email ?? "");
    form.setValue("fullName", s ? fullName || s.fullName || "" : "");
  };

  const pickVideo = (file: File | undefined) => {
    setVideoError(null);
    if (!file) return setVideoFile(null);
    if (file.size > MAX_VIDEO_BYTES) {
      setVideoFile(null);
      setVideoError(t("account.videoTooLarge"));
      return;
    }
    setVideoFile(file);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log("Submitting lead form");
    const warnings: string[] = [];
    const hasTape = values.hasHighlightTape === "yes";
    const video = hasTape ? videoFile : null;

    try {
      if (!repId) {
        throw new Error("Invalid link. Please use the link provided by your sales representative.");
      }
      if (!session) throw new Error(t("account.errSession"));

      setStage(t("account.savingProfile"));
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

      // The player's Ryval profile, the same fields the Ryval onboarding writes.
      const indexes = (chosen: string[], key: string) => {
        const options = t(key).split("|||");
        return chosen.map((c) => options.indexOf(c)).filter((i) => i >= 0);
      };
      try {
        await updateProfile(
          session,
          profilePatch({
            phoneNumber: values.phoneNumber,
            currentClub: values.currentClub,
            position: values.position,
            nationality: values.nationality,
            highschoolGPA: values.highschoolGPA,
            highschoolGradYear: values.highschoolGradYear,
            preferredDivisionIndexes: indexes(values.preferredDivision, "form.divisionOptions"),
            preferredLeagueIndexes: indexes(values.preferredLeague, "form.leagueOptions"),
            highlightsLink: hasTape ? values.highlightsLink : undefined,
          }),
        );
      } catch (err) {
        console.error("Ryval profile save failed:", err);
        warnings.push(t("account.warnProfile"));
      }

      const { error } = await supabase.functions.invoke("submit-lead", {
        body: {
          ...values,
          fullName: values.fullName || session.fullName || "",
          email: session.email,
          position: values.position ? positionEnglish(values.position) : "",
          highlightsLink: hasTape ? values.highlightsLink : "",
          repId,
          playerImage: imageUrl,
          ryvalUserId: session.userId,
          highlightUploaded: !!video,
        },
      });

      if (error) {
        console.error("Error submitting lead:", error.message);
        throw error;
      }

      console.log("Lead submitted successfully");

      // Photo and film go on the Ryval profile after the lead is safe in Pipedrive.
      if (values.playerImage) {
        try {
          const photoId = await uploadPhoto(session, values.playerImage);
          await updateProfile(session, { profile_photo_id: photoId });
        } catch (err) {
          console.error("Ryval photo upload failed:", err);
          if (!warnings.includes(t("account.warnProfile"))) warnings.push(t("account.warnProfile"));
        }
      }
      if (video) {
        try {
          setStage(fill(t("account.uploadingVideo"), { p: 0 }));
          const reelId = await uploadVideo(session, video, (f) =>
            setStage(fill(t("account.uploadingVideo"), { p: Math.round(f * 100) })),
          );
          await updateProfile(session, { highlight_reel_id: reelId });
        } catch (err) {
          console.error("Ryval video upload failed:", err);
          warnings.push(t("account.warnVideo"));
        }
      }

      const fullName = values.fullName || session.fullName || "";
      setDone({ firstName: fullName.trim().split(/\s+/)[0] || "", email: session.email, warnings });
    } catch (error) {
      console.error("Failed to submit lead:", error);
      toast({
        title: t('form.errorTitle'),
        description: error instanceof Error ? error.message : t('form.errorMessage'),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setStage(null);
    }
  };

  if (done) return <LeadSuccess firstName={done.firstName} email={done.email} warnings={done.warnings} />;

  return (
    <div className="space-y-8">
      <RyvalAccountStep session={session} onSession={onAccount} />

      {!session ? (
        <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border px-4 py-8 text-center text-muted-foreground">
          <Lock className="h-4 w-4 shrink-0" />
          {t("account.locked")}
        </p>
      ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('account.positionPlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {POSITIONS.map(([value, english], i) => (
                      <SelectItem key={value} value={value}>
                        {positionLabels[i] || english}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
          <div className="space-y-4 rounded-2xl border border-border p-4">
            <FormField
              control={form.control}
              name="highlightsLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('form.highlightsLink')}</FormLabel>
                  <FormControl>
                      <Input
                        type="text"
                        placeholder="https://youtube.com/..."
                        {...field}
                      />
                  </FormControl>
                  <FormDescription>
                    {t('account.highlightLinkHint')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">{t('account.highlightUpload')}</p>
              {videoFile ? (
                <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-secondary/30 px-3 py-2 text-sm">
                  <span className="truncate">{videoFile.name} · {(videoFile.size / (1024 * 1024)).toFixed(0)} MB</span>
                  <button
                    type="button"
                    onClick={() => setVideoFile(null)}
                    className="inline-flex shrink-0 items-center gap-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                    {t('account.removeFile')}
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border px-4 py-5 text-sm text-muted-foreground transition hover:border-primary/50 hover:text-foreground">
                  <Upload className="h-4 w-4" />
                  <span>{t('account.highlightUploadHint')}</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="sr-only"
                    onChange={(e) => pickVideo(e.target.files?.[0])}
                  />
                </label>
              )}
              {videoError ? <p className="text-sm text-destructive">{videoError}</p> : null}
            </div>
          </div>
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
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? t('form.submitting') : t('form.submit')}
        </Button>
        {stage ? <p className="text-center text-sm text-muted-foreground" aria-live="polite">{stage}</p> : null}
      </form>
    </Form>
      )}
    </div>
  );
};
