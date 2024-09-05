import { ContentType, DayView, IDay } from "@/types/day"
import { LogTypes } from "@/types/log"
import { ISymptom, ISymptomLog, ISymptomOverview } from "@/types/symptom"

/**
 * Creates a symptom log
 * @param time - time of the log
 * @param pain - pain level
 * @param detail - details
 * @returns ISymptomLog
 */
export function buildISymptomLog(time: string, pain: number, detail: string): ISymptomLog {
  return { time, pain, detail }
}

/**
 * Creates a DayView object from a Day object
 * @param day - Day object
 * @returns DayView
 */
export function buildDayView(day: IDay): DayView {
  const content: ContentType[] = [...day.logs, ...day.meds, ...day.meals]
  day.symptoms.forEach(s => content.push(...buildSymptomOverview(s)))
  content.sort((a, b) => a.time.localeCompare(b.time))

  return {
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
    type: LogTypes.symptoms,
    label: symptom.label,
    key: symptom.key,
    time: log.time,
    pain: log.pain,
  }))
  return returnArray
}
