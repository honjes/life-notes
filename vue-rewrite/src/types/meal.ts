import { DataTypes } from "./note"

export interface IMeal {
  type: DataTypes
  time: string
  key: string
  detail: string
}
