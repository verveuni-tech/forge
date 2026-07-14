import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Recommendation } from "@/lib/recommendation-engine";

export interface LocalLoggedSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  weight: number;
  reps: number;
  isWarmup: boolean;
}

export interface WorkoutPlanExercise {
  exerciseId: string;
  exerciseName: string;
  targetSets: number;
  targetRepRangeLow: number;
  targetRepRangeHigh: number;
  restSeconds: number;
  recommendation: Recommendation;
}

interface RestTimerState {
  isResting: boolean;
  secondsRemaining: number;
  targetExerciseId: string | null;
}

interface SelectorState {
  weight: number;
  reps: number;
}

interface ActiveWorkoutState {
  sessionId: string | null;
  startedAt: string | null;
  exercisePlan: WorkoutPlanExercise[];
  currentExerciseIndex: number;
  loggedSetsByExercise: Record<string, LocalLoggedSet[]>;
  selector: SelectorState;
  timer: RestTimerState;

  startWorkout: (sessionId: string, exercisePlan: WorkoutPlanExercise[]) => void;
  logSet: (set: LocalLoggedSet) => void;
  removeSet: (exerciseId: string, setId: string) => void;
  setSelector: (selector: Partial<SelectorState>) => void;
  goToExercise: (index: number) => void;
  nextExercise: () => void;
  startRestTimer: (seconds: number, targetExerciseId: string) => void;
  tickTimer: () => void;
  stopRestTimer: () => void;
  finishWorkout: () => void;
}

export const useActiveWorkoutStore = create<ActiveWorkoutState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      startedAt: null,
      exercisePlan: [],
      currentExerciseIndex: 0,
      loggedSetsByExercise: {},
      selector: { weight: 0, reps: 8 },
      timer: { isResting: false, secondsRemaining: 0, targetExerciseId: null },

      startWorkout: (sessionId, exercisePlan) =>
        set({
          sessionId,
          exercisePlan,
          startedAt: new Date().toISOString(),
          currentExerciseIndex: 0,
          loggedSetsByExercise: {},
          timer: { isResting: false, secondsRemaining: 0, targetExerciseId: null },
        }),

      logSet: (loggedSet) =>
        set((state) => ({
          loggedSetsByExercise: {
            ...state.loggedSetsByExercise,
            [loggedSet.exerciseId]: [
              ...(state.loggedSetsByExercise[loggedSet.exerciseId] ?? []),
              loggedSet,
            ],
          },
        })),

      removeSet: (exerciseId, setId) =>
        set((state) => ({
          loggedSetsByExercise: {
            ...state.loggedSetsByExercise,
            [exerciseId]: (state.loggedSetsByExercise[exerciseId] ?? []).filter(
              (s) => s.id !== setId,
            ),
          },
        })),

      setSelector: (partial) =>
        set((state) => ({ selector: { ...state.selector, ...partial } })),

      goToExercise: (index) => set({ currentExerciseIndex: index }),

      nextExercise: () =>
        set((state) => ({
          currentExerciseIndex: Math.min(
            state.currentExerciseIndex + 1,
            state.exercisePlan.length - 1,
          ),
        })),

      startRestTimer: (seconds, targetExerciseId) =>
        set({ timer: { isResting: true, secondsRemaining: seconds, targetExerciseId } }),

      tickTimer: () => {
        const { timer } = get();
        if (!timer.isResting) return;
        const remaining = timer.secondsRemaining - 1;
        if (remaining <= 0) {
          set({ timer: { isResting: false, secondsRemaining: 0, targetExerciseId: null } });
        } else {
          set({ timer: { ...timer, secondsRemaining: remaining } });
        }
      },

      stopRestTimer: () =>
        set({ timer: { isResting: false, secondsRemaining: 0, targetExerciseId: null } }),

      finishWorkout: () =>
        set({
          sessionId: null,
          startedAt: null,
          exercisePlan: [],
          currentExerciseIndex: 0,
          loggedSetsByExercise: {},
          timer: { isResting: false, secondsRemaining: 0, targetExerciseId: null },
        }),
    }),
    {
      name: "forge-active-workout",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
