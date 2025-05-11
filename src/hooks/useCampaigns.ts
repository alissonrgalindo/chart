import { useEffect } from "react"
import { useCampaignStore } from "@/store/campaignStore"
import type { Campaign } from "@/store/campaignStore"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useCampaigns() {
  const {
    campaigns,
    loading,
    error,
    setCampaigns,
    setLoading,
    setError,
    selectedId,
    setSelectedId,
    addCampaign,
  } = useCampaignStore()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL}/campaigns`)
        const json: Campaign[] = await res.json()

        const local = JSON.parse(
          localStorage.getItem("customCampaigns") || "[]"
        ) as Campaign[]

        setCampaigns([...json, ...local])
        setError(null)
      } catch (error) {
        console.error(error)
        setError("Failed to fetch campaigns")
      } finally {
        setLoading(false)
      }
    }

    if (campaigns.length === 0) {
      fetchData()
    }
  }, [campaigns.length, setCampaigns, setLoading, setError])

  return {
    campaigns,
    loading,
    error,
    selectedId,
    setSelectedId,
    addCampaign,
  }
}
