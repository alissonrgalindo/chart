export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value)

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US").format(value)
