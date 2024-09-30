import { DataTypes } from "./note"

export interface IMedBasic {
  type: DataTypes
  key: string
  quantity: number
  occurrences: number
  lastEntry: string
}

export interface IMedWithId extends IMed {
  _id: string
}

export interface IMed extends IMedBasic {
  log: IMedLog[]
}

export interface IMedLog {
  key: string
  time: string
}

export interface IMedOverview extends IMedBasic {
  logKey: string
  time: string
}

export interface IMedHistory {
  key: string
  quantity: number
  occurrences: number
  lastEntry: string
}
