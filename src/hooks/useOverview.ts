import { useEffect } from "react"
import { useOverviewStore } from "@/store/overviewStore"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useOverview() {
  const {
    data,
    loading,
    error,
    setData,
    setLoading,
    setError,
  } = useOverviewStore()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE_URL}/overview`)
        const json = await res.json()
        setData(json)
        setError(null)
      } catch (error) {
        console.error(error);
        setError("Failed to fetch overview data")
      } finally {
        setLoading(false)
      }
    }

    if (!data) fetchData()
  }, [data, setData, setLoading, setError])

  return { data, loading, error }
}
