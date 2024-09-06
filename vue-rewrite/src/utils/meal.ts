import { LogTypes } from "@/types/log"
import { IMeal } from "@/types/meal"

export function buildMeal(key: string, time: string, detail: string): IMeal {
  return {
    type: LogTypes.meals,
    key: key,
    time: time,
    detail: detail,
  }
}
