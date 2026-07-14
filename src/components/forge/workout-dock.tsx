import { NavLink } from "react-router";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  DumbbellIcon,
  AnalyticsUpIcon,
  Medal01Icon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Home", icon: Home01Icon },
  { to: "/templates", label: "Workout", icon: DumbbellIcon },
  { to: "/progress", label: "Progress", icon: AnalyticsUpIcon },
  { to: "/records", label: "Records", icon: Medal01Icon },
  { to: "/settings", label: "Settings", icon: Settings01Icon },
] as const;

export function WorkoutDock() {
  return (
    <nav className="shape-capsule fixed inset-x-0 bottom-5 z-40 mx-auto flex w-fit items-center gap-1 px-2 py-2">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          className={({ isActive }) =>
            cn(
              "flex min-h-12 min-w-12 flex-col items-center justify-center gap-0.5 rounded-full px-3 text-label transition-colors duration-fast",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )
          }
        >
          <HugeiconsIcon icon={item.icon} size={20} strokeWidth={1.75} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
