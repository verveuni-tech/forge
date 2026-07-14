import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const onboardingSchema = z.object({
  name: z.string().min(1, "Enter your name"),
  units: z.enum(["kg", "lb"]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

const STORAGE_KEY = "forge-onboarding-profile";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { name: "", units: "kg", experienceLevel: "beginner" },
  });

  const onSubmit = handleSubmit(async (values) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    setSubmitted(true);
    setTimeout(() => navigate("/"), 600);
  });

  return (
    <div className="flex min-h-svh flex-col justify-center gap-section px-screen py-section">
      <div>
        <h1 className="text-h1 font-semibold text-foreground">Set up Forge</h1>
        <p className="mt-1 text-body text-muted-foreground">
          A few basics so recommendations fit you from day one.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-label text-muted-foreground">
            Name
          </label>
          <Input id="name" placeholder="Your name" {...register("name")} />
          {errors.name ? (
            <p className="text-caption text-danger">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-label text-muted-foreground">Units</span>
          <Controller
            control={control}
            name="units"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-label text-muted-foreground">Experience level</span>
          <Controller
            control={control}
            name="experienceLevel"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
          {submitted ? "Saved" : "Continue"}
        </Button>
      </form>
    </div>
  );
}
