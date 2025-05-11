export function calculateOverviewStats(
  installs: { day: string; value: number }[],
  revenue: { day: string; value: number }[]
) {
  const totalInstalls = installs.reduce((sum, i) => sum + i.value, 0)
  const totalRevenue = revenue.reduce((sum, r) => sum + r.value, 0)

  return {
    totalInstalls,
    totalRevenue,
    averageInstalls: Math.round(totalInstalls / 7),
    averageRevenue: totalRevenue / 7,
  }
}
