export function normalizeOverview(
  installs: { day: string; value: number }[],
  revenue: { day: string; value: number }[]
) {
  return installs.map((install) => {
    const day = install.day
    const revenueValue = revenue.find((r) => r.day === day)?.value ?? 0

    return {
      day: day.charAt(0).toUpperCase() + day.slice(1),
      installs: install.value,
      revenue: revenueValue,
    }
  })
}
