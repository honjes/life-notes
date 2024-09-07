import { LogTypes } from "./log"

export interface IMedBasic {
  type: LogTypes
  key: string
  quantity: number
}

export interface IMed extends IMedBasic {
  time: string
}

export interface IMedHistory {
  key: string
  quantity: number
  occurrences: number
  lastEntry: string
}
