/**
 * All possible log types
 */
export enum DataTypes {
  symptoms = "symptoms",
  meals = "meals",
  meds = "meds",
  note = "note",
  wakeUp = "wakeUp",
  goToBed = "goToBed",
}

export interface ILog {
  type: DataTypes
  time: string
  key: string
  detail: string
}

export interface ILogHistory {
  key: string
  occurrences: number
  lastEntry: string
}
