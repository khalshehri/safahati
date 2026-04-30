import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { WizardAnswers } from "@/lib/validators";

export interface WizardStore {
  currentStep: number;
  answers: Partial<WizardAnswers>;
  validationErrors: Record<string, string>;
  isLoading: boolean;
  savedAt: number | null;

  setStep: (step: number) => void;
  setAnswers: (answers: Partial<WizardAnswers>) => void;
  updateAnswers: (field: keyof WizardAnswers, value: any) => void;
  setValidationErrors: (errors: Record<string, string>) => void;
  setIsLoading: (loading: boolean) => void;
  setSavedAt: (timestamp: number) => void;
  reset: () => void;
  loadDraft: (draft: any) => void;
}

const INDUSTRIES = [
  { id: "company", label: "Company", labelAr: "شركة" },
  { id: "freelancer", label: "Freelancer", labelAr: "عامل حر" },
  { id: "restaurant", label: "Restaurant", labelAr: "مطعم" },
  { id: "clinic", label: "Clinic", labelAr: "عيادة" },
  { id: "agency", label: "Agency", labelAr: "وكالة" },
  { id: "realEstate", label: "Real Estate", labelAr: "عقارات" },
  { id: "photographer", label: "Photographer", labelAr: "مصور" },
  { id: "lawyer", label: "Lawyer", labelAr: "محامي" },
  { id: "saas", label: "SaaS", labelAr: "برنامج خدمة" },
  { id: "ecommerce", label: "E-commerce", labelAr: "تجارة إلكترونية" },
  { id: "event", label: "Event", labelAr: "حدث" },
  { id: "education", label: "Education", labelAr: "تعليم" },
  { id: "gym", label: "Gym", labelAr: "صالة ألعاب" },
];

export const useWizardStore = create<WizardStore>()(
  immer((set) => ({
    currentStep: 0,
    answers: {},
    validationErrors: {},
    isLoading: false,
    savedAt: null,

    setStep: (step) =>
      set((state) => {
        state.currentStep = step;
      }),

    setAnswers: (answers) =>
      set((state) => {
        state.answers = answers;
      }),

    updateAnswers: (field, value) =>
      set((state) => {
        state.answers[field] = value;
      }),

    setValidationErrors: (errors) =>
      set((state) => {
        state.validationErrors = errors;
      }),

    setIsLoading: (loading) =>
      set((state) => {
        state.isLoading = loading;
      }),

    setSavedAt: (timestamp) =>
      set((state) => {
        state.savedAt = timestamp;
      }),

    reset: () =>
      set((state) => {
        state.currentStep = 0;
        state.answers = {};
        state.validationErrors = {};
        state.isLoading = false;
        state.savedAt = null;
      }),

    loadDraft: (draft) =>
      set((state) => {
        state.currentStep = draft.step || 0;
        state.answers = draft.answers || {};
        state.savedAt = Date.now();
      }),
  }))
);

export { INDUSTRIES };
