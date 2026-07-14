import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      // Same-origin /api fetches don't need the browser's online-detection gate;
      // the PWA's own offline handling covers true connectivity loss.
      networkMode: "always",
    },
  },
});
