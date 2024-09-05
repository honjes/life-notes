import { LogTypes } from "./log"

export interface IMeal {
  type: LogTypes
  time: string
  key: string
  detail: string
}
