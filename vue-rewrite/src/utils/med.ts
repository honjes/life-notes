import { DataTypes } from "@/types/log"
import { IMed } from "@/types/med"

export function buildMed(key: string, quantity: number, time: string): IMed & { _id: string } {
  return {
    _id: `med-${key}`,
    type: DataTypes.meds,
    key: key,
    quantity: quantity,
    time: time,
  }
}
