export function getEventDateString(startDate: Date, endDate: Date) {
  const crossesMonth = startDate.getMonth() !== endDate.getMonth()
  const formattedStartDate = new Intl.DateTimeFormat("sv", {
    day: "numeric",
    month: crossesMonth ? "short" : undefined,
  }).format(startDate)
  const formattedEndDate = new Intl.DateTimeFormat("sv", {
    day: "numeric",
    month: "short",
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
