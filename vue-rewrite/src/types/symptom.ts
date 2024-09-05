import { LogTypes } from "./log"

/**
 * All needed information to display a symptom Badge
 */
export interface ISymptomOverview {
  type: LogTypes
  key: string
  label: string
  /* HH:mm */
  time: string
  pain: number
}

export interface ISymptomLog {
  time: string
  pain: number
  detail: string
}

export interface ISymptom {
  key: string
  pain?: string
  label: string
  logs: ISymptomLog[]
}
