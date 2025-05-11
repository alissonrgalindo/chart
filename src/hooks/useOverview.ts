import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type DayData = {
  day: string;
  value: number;
};

type OverviewResponse = {
  installs: DayData[];
  revenue: DayData[];
};

export function useOverview() {
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await api.get<OverviewResponse>(
          import.meta.env.VITE_API_OVERVIEW_URL
        );
        setData(res.data);
      } catch (error) {
        console.error(error);
        setError("Erro ao buscar dados do overview.");
      } finally {
        setLoading(false);
      }
    }
  
    fetchOverview();
  }, []);
  

  return { data, loading, error };
}
