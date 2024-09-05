import { IDay } from "@/types/day"
import { defineStore } from "pinia"
import { format, subDays } from "date-fns"
import { getDetailedDate } from "@/utils/date"
import { ref } from "vue"
import { ISymptom, ISymptomLog } from "@/types/symptom"

export const useDayStore = defineStore("day", () => {
  const db = new PouchDB("days")
  const updates = ref(0)

  /**
   * Returns an empty IDay object for a given date
   * @param formattedDate - date in format yyyy-MM-dd
   * @returns IDay object
   */
  function buildDay(formattedDate: string): IDay {
    return {
      date: formattedDate,
      detailedDate: getDetailedDate(formattedDate),
      symptomOverviews: [],
      symptoms: [],
      logs: [],
      meds: [],
      meals: [],
      wakeUp: "",
      goToBed: "",
    }
  }

  /**
   * Function to get a specific number of days from the database
   * @param limit - number of days to return
   * @param offset - number of days to skip
   * @returns return array of IDays
   */
  async function getDays(limit: number, offset: number): Promise<IDay[]> {
    const firstDay = subDays(new Date(), offset)
    const expectedDates = new Array<string>()
    for (let i = 0; i < limit; i++) {
      expectedDates.push(format(subDays(firstDay, i), "yyyy-MM-dd"))
    }

    const response = await db.allDocs<IDay>({ include_docs: true, descending: true, keys: expectedDates })
    const returnDays = response.rows.map(row => {
      // if day not found return empty day
      if ("error" in row) {
        return buildDay(row.key)
      }
      return row.doc as IDay
    })
    return returnDays.sort((a, b) => b.date.localeCompare(a.date))
  }

  /**
   * get a specific day from the database or add it if it doesn't exist
   * @param day - day to get
   * @returns IDay object
   */
  async function getOrAddDay(day: string): Promise<IDay> {
    const iDay = await db.get<IDay>(day)

    if (!iDay) {
      const newDay = buildDay(day)
      await db.put(newDay)
      return newDay
    }
    return iDay
  }

  /**
   * Adds a symptom to a day
   * @param symptom - symptom to add
   * @param pain - pain level
   * @param details - details
   */
  async function addSymptom(day: string, symptom: string, log: ISymptomLog) {
    const iDay = await getDay(day)
    if (day.length === 0) throw new Error("No day found")

    // check if symptom already exists
    const symptomIndex = iDay.symptoms.findIndex(s => s.key === symptom)
    // add log to symptom if it exists
    if (symptomIndex != -1) {
      ;(iDay.symptoms[symptomIndex] as ISymptom).logs.push(log)
      await db.put(iDay)
      updates.value++
    }
    // add symptom if it doesn't exist
    else {
      iDay.symptoms.push({ key: symptom, logs: [log] })
      await db.put(iDay)
      updates.value++
    }
  }

  return { getDays, updates, getDay, addSymptom }
})
