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
export interface INoteBasic {
  type: DataTypes
  key: string
  detail: string
}

/**
 * Object of a Note
 */
export interface ILog extends ILogBasic {
export interface INote extends INoteBasic {
  time: string
}

export interface ILogHistory {
  key: string
  occurrences: number
  lastEntry: string
}
