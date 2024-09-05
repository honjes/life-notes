import { LogTypes } from "./log"

export interface IMed {
  type: LogTypes
  key: string
  time: string
  quantity: number
}

export interface IMedHistory {
  key: string
  quantity: number
  occurrences: number
  lastEntry: string
}
