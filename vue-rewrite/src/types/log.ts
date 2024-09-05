/**
 * All possible log types
 */
export enum LogTypes {
  symptoms = "symptoms",
  meals = "meals",
  meds = "meds",
  note = "note",
}

export interface ILog {
  type: LogTypes
  time: string
  key: string
  detail: string
}

export interface ILogHistory {
  key: string
  occurrences: number
  lastEntry: string
}
