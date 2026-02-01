import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStudentTestStore = create(
  persist(
    (set) => ({
      testId: null,

      student: { name: "", email: "" },

      attemptNo: null,
      setAttemptNo: (n) => set({ attemptNo: n }),

      questions: [],
      answers: {},

      setTest: (testId) => set({ testId }),

      setStudent: (name, email) =>
        set({ student: { name, email } }),

      setQuestions: (questions) => set({ questions }),

      setAnswer: (questionId, optionKey) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [questionId]: optionKey,
          },
        })),

      resetTest: () =>
        set({
          testId: null,
          student: { name: "", email: "" },
          attemptNo: null,
          questions: [],
          answers: {},
        }),
    }),
    {
      name: "student-test-storage", // localStorage key
      partialize: (state) => ({
        testId: state.testId,
        student: state.student,
        attemptNo: state.attemptNo,
        questions: state.questions,
        answers: state.answers,
      }),
    }
  )
);
