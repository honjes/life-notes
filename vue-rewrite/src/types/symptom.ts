import { DataTypes } from "./note"

/**
 * All needed information to display a symptom Badge
 */
export interface ISymptomOverview {
  type: DataTypes
  key: string
  /* key of the log */
  logKey: string
  label: string
  /* HH:mm */
  time: string
  pain: number
  detail: string
}

export interface ISymptomLog {
  key: string
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
