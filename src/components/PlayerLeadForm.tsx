import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
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
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .max(20, { message: "Phone must be less than 20 characters" })
    .optional()
    .or(z.literal("")),
  position: z
    .string()
    .min(1, { message: "Please select a position" }),
  experience: z
    .string()
    .min(1, { message: "Please select experience level" }),
  notes: z
    .string()
    .trim()
    .max(1000, { message: "Notes must be less than 1000 characters" })
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export const PlayerLeadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      notes: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    console.log("Submitting lead to Pipedrive:", values);

    try {
      const { data, error } = await supabase.functions.invoke("submit-lead", {
        body: values,
      });

      if (error) {
        console.error("Error submitting lead:", error);
        throw error;
      }

      console.log("Lead submitted successfully:", data);

      toast({
        title: "Success!",
        description: "Your information has been submitted. We'll be in touch soon!",
      });

      form.reset();
    } catch (error) {
      console.error("Failed to submit lead:", error);
      toast({
        title: "Error",
        description: "Failed to submit your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-2xl shadow-2xl border border-border p-8 md:p-12">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Full Name *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John Doe"
                    className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary"
                    {...field}
                  />
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
                <FormLabel className="text-base font-semibold">Email *</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Phone (Optional)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary"
                    {...field}
                  />
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
                <FormLabel className="text-base font-semibold">Position *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Select your position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="striker">Striker</SelectItem>
                    <SelectItem value="midfielder">Midfielder</SelectItem>
                    <SelectItem value="defender">Defender</SelectItem>
                    <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                    <SelectItem value="winger">Winger</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Experience Level *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 text-base transition-all duration-200 focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (5-10 years)</SelectItem>
                    <SelectItem value="professional">Professional (10+ years)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">
                  Additional Information (Optional)
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Tell us about your achievements, goals, or any questions you have..."
                    className="min-h-[120px] text-base resize-none transition-all duration-200 focus:ring-2 focus:ring-primary"
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
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-accent-blue to-primary hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
