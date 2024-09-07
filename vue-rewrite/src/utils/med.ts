import { LogTypes } from "@/types/log"
import { IMed } from "@/types/med"

export function buildMed(key: string, quantity: number, time: string): IMed & { _id: string } {
  return {
    _id: `med-${key}`,
    type: LogTypes.meds,
    key: key,
    quantity: quantity,
    time: time,
  }
}
