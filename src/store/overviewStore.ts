import { create } from "zustand"

export interface OverviewDay {
  day: string
  value: number
}

interface OverviewData {
  installs: OverviewDay[]
  revenue: OverviewDay[]
}

interface OverviewState {
  data: OverviewData | null
  loading: boolean
  error: string | null
  setData: (data: OverviewData) => void
  setLoading: (loading: boolean) => void
  setError: (message: string | null) => void
}

export const useOverviewStore = create<OverviewState>((set) => ({
  data: null,
  loading: true,
  error: null,
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
  setError: (message) => set({ error: message }),
}))
