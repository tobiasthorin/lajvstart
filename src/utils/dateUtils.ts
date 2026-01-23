export function getEventDateString(
  startDate: Date,
  endDate: Date,
  options?: { monthFormat?: Intl.DateTimeFormatOptions["month"] },
) {
  const crossesMonth = startDate.getMonth() !== endDate.getMonth()
  const formattedStartDate = new Intl.DateTimeFormat("sv", {
    day: "numeric",
    month: crossesMonth ? options?.monthFormat || "short" : undefined,
  }).format(startDate)
  const formattedEndDate = new Intl.DateTimeFormat("sv", {
    day: "numeric",
    month: options?.monthFormat || "short",
  }).format(endDate)

  if (startDate.toDateString() === endDate.toDateString())
    return formattedEndDate

  return `${formattedStartDate} - ${formattedEndDate}`
}

export function getFriendlyDate(
  date: Date,
  options?: { displayYear?: boolean },
) {
  return new Intl.DateTimeFormat("sv", {
    day: "numeric",
    month: "long",
    year: options?.displayYear ? "numeric" : undefined,
  }).format(date)
}
