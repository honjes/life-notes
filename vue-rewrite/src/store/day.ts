import { defineStore } from "pinia"
import { format, subDays } from "date-fns"
import { buildMed, dateFormat, getDetailedDate } from "@/utils"
import { IDay, IMeal, ISymptom, ISymptomLog, IMed, IMedLog, INoteBasic, INoteLog, DataTypes } from "@/types"
import { ref } from "vue"

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
      expectedDates.push(format(subDays(firstDay, i), dateFormat))
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
      // check if log already exists
      const logIndex = iDay.symptoms[symptomIndex].logs.findIndex(l => l.key === log.key)
      if (logIndex != -1) {
        // update log
        iDay.symptoms[symptomIndex].logs[logIndex] = log
      } else {
        // add log to symptom
        iDay.symptoms[symptomIndex].logs.push(log)
      }

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

    // check if meal already exists
    const mealIndex = iDay.meals.findIndex(m => m.key === meal.key)
    if (mealIndex != -1) {
      // update meal
      iDay.meals[mealIndex] = meal
    } else {
      // add meal to day
      iDay.meals.push(meal)
    }

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
  async function addMed(day: string, med: IMed, log: IMedLog) {
    const iDay = await getDay(day)

    // check if med already exists
    const medIndex = iDay.meds.findIndex(m => m.key === med.key)
    if (medIndex != -1) {
      // check if log already exists
      const logIndex = iDay.meds[medIndex].log.findIndex(t => t.key === log.key)
      if (logIndex != -1) {
        // update med
        iDay.meds[medIndex].log[logIndex].time = log.time
      } else {
        // add med to day
        iDay.meds[medIndex].log.push(log)
      }
    } else {
      // add med to day
      iDay.meds.push(buildMed(med.key, med.quantity, log))
    }

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
   * Adds a note to a day
   * @param {string} day - day to add
   * @param {INote} note - note to add
   */
  async function addNote(day: string, note: INoteBasic, log: INoteLog) {
    const iDay = await getDay(day)

    // check if note already exists
    const noteIndex = iDay.logs.findIndex(l => l.key === note.key)
    if (noteIndex != -1) {
      // check if log already exists
      const logIndex = iDay.logs[noteIndex].log.findIndex(t => t.key === log.key)
      if (logIndex != -1) {
        // update note
        iDay.logs[noteIndex].log[logIndex].time = log.time
        iDay.logs[noteIndex].log[logIndex].detail = log.detail
      } else {
        // add note to day
        iDay.logs[noteIndex].log.push(log)
      }
    } else {
      // add note to day
      iDay.logs.push({ ...note, log: [log] })
    }

    // update Day
    try {
      await db.put(iDay)
      // update store
      updates.value++
      dayUpdate.value = [day]
    } catch (err) {
      console.error("add note error: ", err)
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

  /**
   * Deletes Data from a day
   * @param {string} day - day to delete data from
   * @param {DataTypes} type - type of data to delete
   * @param {string} key - key of data to delete
   * @param {string} logKey - key of log to delete (required for symptoms, meds and notes)
   */
  async function deleteData(day: string, type: DataTypes, key: string, logKey?: string): Promise<void> {
    const iDay = await getDay(day)

    switch (type) {
      case DataTypes.symptoms: {
        const symptomIndex = iDay.symptoms.findIndex(s => s.key !== key)
        if (symptomIndex != -1) {
          // delete symptom log
          iDay.symptoms[symptomIndex].logs = iDay.symptoms[symptomIndex].logs.filter(l => l.key !== logKey)
        }
        break
      }
      case DataTypes.meds: {
        // delete med log
        const medIndex = iDay.meds.findIndex(m => m.key === key)
        if (medIndex != -1) {
          iDay.meds[medIndex].log = iDay.meds[medIndex].log.filter(l => l.key !== logKey)
        }
        break
      }
      case DataTypes.meals: {
        iDay.meals = iDay.meals.filter(m => m.key !== key)
        break
      }
      case DataTypes.note: {
        // delete note log
        const noteIndex = iDay.logs.findIndex(l => l.key === key)
        if (noteIndex != -1) {
          iDay.logs[noteIndex].log = iDay.logs[noteIndex].log.filter(l => l.key !== logKey)
        }
        break
      }
      default:
        throw new Error("Unknown data type")
    }
    // update store
    try {
      await db.put(iDay)
      updates.value++
      dayUpdate.value = [day]
    } catch (err) {
      console.error("delete data error: ", err)
      throw err
    }
  }

  return {
    updates,
    dayUpdate,
    getDays,
    getDay: getDay,
    addSymptom,
    addMeal,
    addMed,
    addNote,
    addWakeUp,
    addGoToBed,
    deleteData,
  }
})
