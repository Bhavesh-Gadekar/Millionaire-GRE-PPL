import { create } from "zustand";

export const useTestsStore = create((set, get) => ({
  tests: [],

  setTests: (tests) => set({ tests }),   // <-- overwrite all tests

  addTest: (test) => set((state) => ({ tests: [...state.tests, test] })),

  updateTest: (updated) =>
    set((state) => ({
      tests: state.tests.map((t) =>
        t.test_id === updated.test_id ? updated : t
      ),
    })),

  deleteTest: (test_id) =>
    set((state) => ({
      tests: state.tests.filter((t) => t.test_id !== test_id),
    })),

  getTestById: (test_id) => get().tests.find((t) => t.test_id === test_id),
}));
