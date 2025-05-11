import { create } from "zustand"

export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday"

export interface Campaign {
  id: string
  name: string
  installs: { day: WeekDay; value: number }[]
  revenue?: { day: WeekDay; value: number }[]
}

interface CampaignState {
  campaigns: Campaign[]
  selectedId: string | null
  loading: boolean
  error: string | null
  setCampaigns: (data: Campaign[]) => void
  addCampaign: (campaign: Campaign) => void
  setSelectedId: (id: string | null) => void
  setLoading: (value: boolean) => void
  setError: (msg: string | null) => void
}

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: [],
  selectedId: localStorage.getItem("selectedCampaignId"),
  loading: true,
  error: null,
  setCampaigns: (data) => set({ campaigns: data }),
  addCampaign: (campaign) =>
    set((state) => ({ campaigns: [...state.campaigns, campaign] })),
  setSelectedId: (id) => {
    localStorage.setItem("selectedCampaignId", id ?? "")
    set({ selectedId: id })
  },
  setLoading: (value) => set({ loading: value }),
  setError: (msg) => set({ error: msg }),
}))
