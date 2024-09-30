import { INote, INoteOverview } from "./note"
import { IMeal } from "./meal"
import { IMed, IMedOverview } from "./med"
import { ISymptom, ISymptomOverview } from "./symptom"

export interface IDayOverview {
  /* yyyy-MM-dd */
  date: string
  symptomOverviews: ISymptomOverview[]
  /* HH:mm */
  wakeUp: string
  /* HH:mm */
  goToBed: string
}

export interface IDay extends IDayOverview {
  logs: INote[]
  symptoms: ISymptom[]
  meds: IMed[]
  meals: IMeal[]
}

export type ContentType = INoteOverview | ISymptomOverview | IMedOverview | IMeal

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
  date: string
  formattedDate: string
}
