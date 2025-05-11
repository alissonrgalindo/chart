import { useOverview } from "@/hooks/useOverview"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Overview() {
  const { data, loading, error } = useOverview()

  if (loading) return <p className="p-4">Carregando...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  )
}
