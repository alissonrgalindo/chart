type DayValue = { day: string; value: number }

export function calculateOverviewStats(installs: DayValue[], revenue: DayValue[]) {
  const totalInstalls = installs.reduce((acc, cur) => acc + cur.value, 0)
  const totalRevenue = revenue.reduce((acc, cur) => acc + cur.value, 0)

  const averageInstalls = totalInstalls / installs.length
  const averageRevenue = totalRevenue / revenue.length

  return {
    totalInstalls,
    totalRevenue,
    averageInstalls,
    averageRevenue,
  }
}
