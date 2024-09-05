import { ISymptomLog } from "@/types/symptom"

/**
 * Creates a symptom log
 * @param time - time of the log
 * @param pain - pain level
 * @param detail - details
 * @returns ISymptomLog
 */
export function buildSymptomLog(time: string, pain: number, detail: string): ISymptomLog {
  return { time, pain, detail }
}
