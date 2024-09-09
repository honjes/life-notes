import { ILog } from "./log"
import { IMeal } from "./meal"
import { IMed, IMedOverview } from "./med"
import { ISymptom, ISymptomOverview } from "./symptom"

export interface IDayOverview {
  /* yyyy-MM-dd */
  date: string
  detailedDate: IDetailedDate
  symptomOverviews: ISymptomOverview[]
  /* HH:mm */
  wakeUp: string
  /* HH:mm */
  goToBed: string
}

export interface IDay extends IDayOverview {
  logs: ILog[]
  symptoms: ISymptom[]
  meds: IMed[]
  meals: IMeal[]
}

export type ContentType = ILog | ISymptomOverview | IMedOverview | IMeal

export interface DayView {
  date: string
  wakeUp: string
  goToBed: string
  content: ContentType[]
  symptoms: ISymptom[]
}

export interface IDetailedDate {
  day: number
  month: number
  year: number
  week: number
  dayOfWeek: number
  dayOfYear: number
  weekOfMonth: number
  /* JS Date object */
  date: Date
  formattedDate: string
}
