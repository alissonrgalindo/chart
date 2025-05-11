type DayValue = { day: string; value: number }

export function normalizeOverview(
  installs: DayValue[],
  revenue: DayValue[]
) {
  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ]

  return weekDays.map((day) => {
    const installData = installs.find((d) => d.day === day)?.value || 0
    const revenueData = revenue.find((d) => d.day === day)?.value || 0

    return {
      day,
      installs: installData,
      revenue: revenueData,
    }
  })
}
