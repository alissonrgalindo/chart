import { useEffect } from "react";
import { useCampaignStore } from "@/store/campaignStore";
import type { Campaign } from "@/store/campaignStore";
import { api, endpoints } from "@/lib/api";

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
  } = useCampaignStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(endpoints.campaigns);
        const json: Campaign[] = res.data;

        const local = JSON.parse(
          localStorage.getItem("customCampaigns") || "[]"
        ) as Campaign[];

        setCampaigns([...json, ...local]);
        setError(null);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setError("Failed to fetch campaigns. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (campaigns.length === 0) {
      fetchData();
    }
  }, [campaigns.length, setCampaigns, setLoading, setError]);

  return {
    campaigns,
    loading,
    error,
    selectedId,
    setSelectedId,
    addCampaign,
  };
}
