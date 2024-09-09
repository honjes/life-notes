import { DataTypes } from "@/types/log"
import { IMeal } from "@/types/meal"

export function buildMeal(key: string, time: string, detail: string): IMeal & { _id: string } {
  return {
    _id: `meal-${key}`,
    type: DataTypes.meals,
    key: key,
    time: time,
    detail: detail,
  }
}
