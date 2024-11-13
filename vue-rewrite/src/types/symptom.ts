import { DataTypes } from "./note"

export interface IShortSymptomOverview {
  key: string
  pain: number
}

/**
 * All needed information to display a symptom Badge
 */
export interface ISymptomOverview extends IShortSymptomOverview {
  type: DataTypes
  /* key of the log */
  logKey: string
  label: string
  /* HH:mm */
  time: string
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
