import { IDay } from "@/types/day"
import { defineStore } from "pinia"
import { format, subDays } from "date-fns"
import { getDetailedDate } from "@/utils/date"

export const useDayStore = defineStore("day", () => {
  const db = new PouchDB("days")

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

  return { getDays }
})
