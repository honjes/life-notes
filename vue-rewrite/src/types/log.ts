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

/**
 * Note object without time for the store
 */
export interface ILogBasic {
  type: DataTypes
  key: string
  detail: string
}

/**
 * Object of a Note
 */
export interface ILog extends ILogBasic {
  time: string
}

export interface ILogHistory {
  key: string
  occurrences: number
  lastEntry: string
}
