import { Outlet } from "react-router";
import { WorkoutDock } from "@/components/forge/workout-dock";

export function MainLayout() {
  return (
    <div className="min-h-svh bg-background pb-28">
      <Outlet />
      <WorkoutDock />
    </div>
  );
}
