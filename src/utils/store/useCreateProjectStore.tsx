import { create } from "zustand";

import {
  TProjectDurationSchema,
  TProjectFundSchema,
} from "@/schema/project.schema"; // Import your schemas
import { TProjectBasicsSchema } from "@/schema/project.client.schema";

type ProjectState = {
  step: "basic" | "fund" | "duration" | "review";
  projectBasics: Partial<TProjectBasicsSchema>;
  projectFund: Partial<TProjectFundSchema>;
  projectDuration: Partial<TProjectDurationSchema>;
  setStep: (step: "basic" | "fund" | "duration" | "review") => void;
  setProjectBasics: (data: Partial<TProjectBasicsSchema>) => void;
  setProjectFund: (data: Partial<TProjectFundSchema>) => void;
  setProjectDuration: (data: Partial<TProjectDurationSchema>) => void;
  reset: () => void;
};

const useProjectStore = create<ProjectState>((set, get) => ({
  step: "basic",
  projectBasics: {},
  projectFund: {},
  projectDuration: {},
  setStep: (step: "basic" | "fund" | "duration" | "review") => set({ step }),
  setProjectBasics: (data) =>
    set({ projectBasics: { ...get().projectBasics, ...data } }),
  setProjectFund: (data) =>
    set({ projectFund: { ...get().projectFund, ...data } }),
  setProjectDuration: (data) =>
    set({ projectDuration: { ...get().projectDuration, ...data } }),
  reset: () => {
    set({
      step: "basic",
      projectBasics: {},
      projectFund: {},
      projectDuration: {},
    });
  },
}));
export default useProjectStore;
