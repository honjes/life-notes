import { IDay } from "@/types/day"
import { defineStore } from "pinia"
import { format, subDays } from "date-fns"
import { getDetailedDate } from "@/utils/date"
import { ref } from "vue"
import { ISymptom, ISymptomLog } from "@/types/symptom"
import { IMeal } from "@/types/meal"
import { IMed } from "@/types/med"

export const useDayStore = defineStore("day", () => {
  const db = new PouchDB("days")
  const updates = ref(0)
  const dayUpdate = ref<string[]>([])

  /**
   * Returns an empty IDay object for a given date
   * @param formattedDate - date in format yyyy-MM-dd
   * @returns IDay object
   */
  function buildDay(formattedDate: string): IDay & { _id: string } {
    return {
      _id: formattedDate,
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
   * get a specific day from the database or empty day if it doesn't exist
   * @param day - day to get
   * @returns IDay object
   */
  async function getDay(day: string): Promise<IDay> {
    // try to get the day
    try {
      return await db.get<IDay>(day)
    } catch (err: unknown) {
      // if it doesn't exist, return empty day
      const tErr = err as PouchDB.Core.Error
      if (tErr.name === "not_found") {
        return buildDay(day)
      }
      // if there is another error, throw it
      else {
        throw err
      }
    }
  }

  /**
   * Adds a symptom to a day
   * @param symptom - symptom to add
   * @param pain - pain level
   * @param details - details
   */
  async function addSymptom(day: string, symptom: ISymptom, log: ISymptomLog) {
    const iDay = await getDay(day)

    // check if symptom already exists
    const symptomIndex = iDay.symptoms.findIndex(s => s.key === symptom.key)
    // add log to symptom if it exists
    if (symptomIndex != -1) {
      // add log to symptom
      ;(iDay.symptoms[symptomIndex] as ISymptom).logs.push(log)

      // update Day
      try {
        await db.put(iDay)
        // update store
        updates.value++
        dayUpdate.value = [day]
      } catch (err) {
        console.error("add log to existing symptom error: ", err)
        throw err
      }
    }
    // add symptom if it doesn't exist
    else {
      try {
        const symptomToAdd = { key: symptom.key, label: symptom.label, logs: [log] }
        // add symptom to day
        iDay.symptoms.push(symptomToAdd)

        // update Day
        await db.put(iDay)

        // update store
        updates.value++
        dayUpdate.value = [day]
      } catch (err) {
        console.error("Error adding symptom: ", err)
        throw err
      }
    }
  }

  /**
   * Adds a meal to a day
   * @param {string} day - day to add
   * @param {IMeal} meal - meal to add
   */
  async function addMeal(day: string, meal: IMeal) {
    const iDay = await getDay(day)

    // add meal to day
    iDay.meals.push(meal)

    // update Day
    try {
      await db.put(iDay)
      // update store
      updates.value++
      dayUpdate.value = [day]
    } catch (err) {
      console.error("add meal error: ", err)
      throw err
    }
  }

  /**
   * Adds a med to a day
   * @param {string} day - day to add
   * @param {IMed} med - med to add
   */
  async function addMed(day: string, med: IMed) {
    const iDay = await getDay(day)

    // add med to day
    iDay.meds.push(med)

    // update Day
    try {
      await db.put(iDay)
      // update store
      updates.value++
      dayUpdate.value = [day]
    } catch (err) {
      console.error("add med error: ", err)
      throw err
    }
  }

  /**
   * Adds a wake up to a day
   * @param {string} day - day to add
   * @param {string} time - time of the wake up
   */
  async function addWakeUp(day: string, time: string) {
    const iDay = await getDay(day)

    // add wake up to day
    iDay.wakeUp = time

    // update Day
    try {
      await db.put(iDay)
      // update store
      updates.value++
      dayUpdate.value = [day]
    } catch (err) {
      console.error("add wake up error: ", err)
      throw err
    }
  }

  /**
   * Adds a go to bed to a day
   * @param {string} day - day to add
   * @param {string} time - time of the go to bed
   */
  async function addGoToBed(day: string, time: string) {
    const iDay = await getDay(day)

    // add go to bed to day
    iDay.goToBed = time

    // update Day
    try {
      await db.put(iDay)
      // update store
      updates.value++
      dayUpdate.value = [day]
    } catch (err) {
      console.error("add go to bed error: ", err)
      throw err
    }
  }

  return { updates, dayUpdate, getDays, getDay: getDay, addSymptom, addMeal, addMed, addWakeUp, addGoToBed }
})
