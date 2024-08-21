import { IDetailedDate } from "@/types/day"
import { getDayOfYear, getWeek, getWeeksInMonth } from "date-fns"

export function getDetailedDate(formattedDate: string): IDetailedDate {
  const date = new Date(formattedDate)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  const weekOfMonth = getWeeksInMonth(formattedDate)
  const week = getWeek(date)
  const dayOfYear = getDayOfYear(date)
  const dayOfWeek = date.getDay()

  return { day, month, year, week, dayOfWeek, dayOfYear, weekOfMonth, date, formattedDate }
}
