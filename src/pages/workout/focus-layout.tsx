import { Outlet } from "react-router";

/** Workout Mode Is Sacred (forge.md Principle 7): no nav, no chrome, nothing but the workout. */
export function FocusLayout() {
  return (
    <div className="min-h-svh bg-background">
      <Outlet />
    </div>
  );
}
