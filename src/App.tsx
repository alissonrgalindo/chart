import { useOverview } from "@/hooks/useOverview";

function App() {
  const { data, loading, error } = useOverview();

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="p-4">
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export default App
