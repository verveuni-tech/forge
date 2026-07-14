import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-svh flex-col gap-section px-screen py-section">
      <h1 className="text-h1 font-semibold text-foreground">Settings</h1>

      <section className="shape-workout-card p-card">
        <h2 className="text-h3 font-medium text-foreground">Theme</h2>
        <p className="mt-1 text-caption text-muted-foreground">
          Forge is premium in both — light is the primary experience.
        </p>
        <div className="mt-4 flex gap-2">
          {THEME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTheme(option.value)}
              className={cn(
                "min-h-12 flex-1 rounded-full border text-caption font-medium transition-colors duration-fast",
                theme === option.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
