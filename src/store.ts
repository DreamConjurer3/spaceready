import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QUESTION_BANK } from './data/config';

interface AppState {
  answers: Record<number, number>;
  setAnswer: (questionId: number, score: number) => void;
  // Placeholder for future state like assessments, baseline
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      answers: {},
      setAnswer: (questionId, score) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: score },
        })),
    }),
    {
      name: 'space-ready-storage',
    }
  )
);
