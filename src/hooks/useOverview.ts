import { useEffect } from "react";
import { useOverviewStore } from "@/store/overviewStore";
import { api, endpoints } from "@/lib/api";

export function useOverview() {
  const {
    data,
    loading,
    error,
    setData,
    setLoading,
    setError,
  } = useOverviewStore();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(endpoints.overview);
      setData(res.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching overview data:", error);
      setError("Failed to fetch overview data. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!data) fetchData();
  }, [data, setData, setLoading, setError]);

  return { 
    data, 
    loading, 
    error,
    refetch: fetchData
  };
}