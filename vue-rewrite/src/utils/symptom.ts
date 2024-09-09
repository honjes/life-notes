import { DataTypes, ISymptom, ISymptomLog, ISymptomOverview, ContentType, DayView, IDay } from "@/types"
import { buildMedOverview, buildNoteOverview, randomNumber } from "."

/**
 * Creates a symptom log
 * @param time - time of the log
 * @param pain - pain level
 * @param detail - details
 * @returns ISymptomLog
 */
export function buildISymptomLog(time: string, pain: number, detail: string): ISymptomLog {
  return { key: randomNumber(), time, pain, detail }
}

/**
 * Creates a DayView object from a Day object
 * @param day - Day object
 * @returns DayView
 */
export function buildDayView(day: IDay): DayView {
  const content: ContentType[] = [...day.meals]
  day.logs.forEach(l => content.push(...buildNoteOverview(l)))
  day.meds.forEach(m => content.push(...buildMedOverview(m)))
  day.symptoms.forEach(s => content.push(...buildSymptomOverview(s)))
  content.sort((a, b) => a.time.localeCompare(b.time))

  return {
    date: day.date,
    wakeUp: day.wakeUp,
    goToBed: day.goToBed,
    content,
    symptoms: [...day.symptoms],
  }
}

/**
 * Creates a SymptomOverview object from a Symptom object
 * @param symptom - Symptom object
 * @returns SymptomOverview
 */
export function buildSymptomOverview(symptom: ISymptom): ISymptomOverview[] {
  const returnArray: ISymptomOverview[] = symptom.logs.map(log => ({
    type: DataTypes.symptoms,
    label: symptom.label,
    key: symptom.key,
    logKey: log.key,
    time: log.time,
    pain: log.pain,
    detail: log.detail,
  }))
  return returnArray
}
