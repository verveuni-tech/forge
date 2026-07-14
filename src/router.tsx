import { createBrowserRouter } from "react-router";
import { SplashGate } from "@/pages/splash-gate";
import { MainLayout } from "@/pages/root-layout";
import { FocusLayout } from "@/pages/workout/focus-layout";
import { HomePage } from "@/pages/home/home-page";
import { WorkoutTemplatesPage } from "@/pages/templates/workout-templates-page";
import { WorkoutFocusPage } from "@/pages/workout/workout-focus-page";
import { WorkoutSummaryPage } from "@/pages/workout/workout-summary-page";
import { ExerciseLibraryPage } from "@/pages/exercise-library/exercise-library-page";
import { ExerciseDetailPage } from "@/pages/exercise-detail/exercise-detail-page";
import { ProgressPage } from "@/pages/progress/progress-page";
import { RecordsPage } from "@/pages/records/records-page";
import { HistoryPage } from "@/pages/history/history-page";
import { CoachPage } from "@/pages/coach/coach-page";
import { SettingsPage } from "@/pages/settings/settings-page";
import { OnboardingPage } from "@/pages/onboarding/onboarding-page";

export const router = createBrowserRouter([
  {
    element: <SplashGate />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/", element: <HomePage /> },
          { path: "/templates", element: <WorkoutTemplatesPage /> },
          { path: "/exercises", element: <ExerciseLibraryPage /> },
          { path: "/exercises/:id", element: <ExerciseDetailPage /> },
          { path: "/progress", element: <ProgressPage /> },
          { path: "/records", element: <RecordsPage /> },
          { path: "/history", element: <HistoryPage /> },
          { path: "/coach", element: <CoachPage /> },
          { path: "/settings", element: <SettingsPage /> },
          { path: "/onboarding", element: <OnboardingPage /> },
        ],
      },
      {
        element: <FocusLayout />,
        children: [
          { path: "/workout", element: <WorkoutFocusPage /> },
          { path: "/workout/summary/:sessionId", element: <WorkoutSummaryPage /> },
        ],
      },
    ],
  },
]);
