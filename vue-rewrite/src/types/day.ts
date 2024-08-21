import { ILog } from "./log"
import { IMeal } from "./meal"
import { IMed } from "./med"
import { ISymptom, ISymptomOverview } from "./symptom"

export interface IDayOverview {
  date: string
  detailedDate: IDetailedDate
  symptomOverviews: ISymptomOverview[]
  wakeUp: string
  goToBed: string
}

export interface IDay extends IDayOverview {
  logs: ILog[]
  symptoms: ISymptom[]
  meds: IMed[]
  meals: IMeal[]
}

export interface IDetailedDate {
  day: number
  month: number
  year: number
  week: number
  dayOfWeek: number
  dayOfYear: number
  weekOfMonth: number
  date: Date
  formattedDate: string
}
