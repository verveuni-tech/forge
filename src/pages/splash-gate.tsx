import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

interface ActiveSession {
  id: string;
}

/** Screen 1 (Splash): silently checks for a resumable workout and redirects into Focus Mode. */
export function SplashGate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data } = useQuery({
    queryKey: ["sessions", "active"],
    queryFn: () => apiGet<ActiveSession | null>("/api/sessions/active"),
    retry: false,
  });

  useEffect(() => {
    if (data && !location.pathname.startsWith("/workout")) {
      navigate("/workout", { replace: true });
    }
  }, [data, location.pathname, navigate]);

  return <Outlet />;
}
