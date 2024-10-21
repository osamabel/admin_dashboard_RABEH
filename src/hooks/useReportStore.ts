import { create } from 'zustand';

interface ReportState {
  shouldRefetch: boolean;
  setShouldRefetch: (value: boolean) => void;
}

export const useReportStore = create<ReportState>((set) => ({
  shouldRefetch: false,
  setShouldRefetch: (value) => set({ shouldRefetch: value }),
}));