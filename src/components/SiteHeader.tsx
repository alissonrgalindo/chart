export function SiteHeader({ title }: { title: string }) {
  return (
    <header className="flex h-12 items-center border-b bg-gray-50 px-6">
      <h1 className="text-lg font-medium">{title}</h1>
    </header>
  )
}
