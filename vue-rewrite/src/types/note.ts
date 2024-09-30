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
  occurrences: number
  lastEntry: string
}

export interface INoteOverview extends INoteBasic {
  logKey: string
  time: string
  detail: string
}

/**
 * Object of a Note
 */
export interface INote extends INoteBasic {
  log: INoteLog[]
}

export interface INoteWithId extends INote {
  _id: string
}

export interface INoteLog {
  key: string
  time: string
  detail: string
}

export interface INoteHistory {
  key: string
  occurrences: number
  lastEntry: string
}
