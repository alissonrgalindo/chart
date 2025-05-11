import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type DayData = {
  day: string;
  value: number;
};

type Campaign = {
  id: string;
  name: string;
  installs: DayData[];
};

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await api.get<Campaign[]>(
          import.meta.env.VITE_API_CAMPAIGNS_URL
        );
        setCampaigns(res.data);
      } catch (error) {
        console.error(error);
        setError("Erro ao buscar campanhas.");
      } finally {
        setLoading(false);
      }
    }
  
    fetchCampaigns();
  }, []);
  

  return { campaigns, loading, error };
}
