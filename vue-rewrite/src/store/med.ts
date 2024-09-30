import { IMedBasic } from "@/types/med"
import { NotFoundError, NotFoundErrors } from "@/utils"
import { isAfter } from "date-fns"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useMedStore = defineStore("med", () => {
  /**
   * @TODO make it possible to have 2 meds with diffrent amounts
   */
  let db = new PouchDB<IMedBasic>("meds")
  // create indexes
  db.createIndex({ index: { fields: ["key"] } })

  const updates = ref(0)
  const medUpdate = ref<string[]>([])

  /**
   * Initalise med DB with given data
   * !!! This will delete all data in the DB !!!
   * @param {IMedBasic[]} data - data to initalise DB with
   */
  async function resetDB(data: IMedBasic[]): Promise<void> {
    await db.destroy()
    db = new PouchDB<IMedBasic>("meds")
    await db.bulkDocs(data)
  }

  /**
   * returns all meds
   * @returns Promise<IMed[]>
   */
  async function getMeds(): Promise<IMedBasic[]> {
    return (
      (await db.allDocs({ include_docs: true, descending: true })).rows
        .map(row => row.doc as IMedBasic)
        // @ts-expect-error - ignore rows that include language (probably the index reference of the db)
        .filter(s => s.language !== "query")
    )
  }

  /**
   * returns a med by key
   * @param {string} key - med key
   * @returns Promise<IMed>
   */
  async function getMed(key: string): Promise<IMedBasic> {
    try {
      return await db.get(`med-${key}`)
    } catch (err: unknown) {
      // @ts-expect-error - check if err is a PouchDB error
      if (err.name === "not_found" && err.status === 404) {
        throw new NotFoundError(NotFoundErrors.MedNotFound)
      }
      console.error("get med error: ", err)
      throw err
    }
  }

  /**
   * add a med to the database
   * @param {IMedBasic} med - med to add
   */
  async function addMed(med: IMedBasic) {
    // check if med already exists
    try {
      await db.put(med)
      // update store
      updates.value++
      medUpdate.value = [med.key]
    } catch (err) {
      console.error("add med error: ", err)
      throw err
    }
  }

  /**
   * Adds a med occurrence
   * @param {string} key - key of the med
   * @TODO check if there the current time is realy the last entry
   */
  async function addOccurrence(key: string, newTime: string) {
    try {
      const med = await db.get(`med-${key}`)
      const newMed = { ...med }
      newMed.occurrences++
      if (isAfter(new Date(newTime), new Date(newMed.lastEntry))) {
        newMed.lastEntry = newTime
      }

      await db.upsert(`med-${med.key}`, () => newMed)
      // update store
      updates.value++
      medUpdate.value = [med.key]
    } catch (err) {
      console.error("add med occurrence error: ", err)
      throw err
    }
  }

  /**
   * Removes a med occurrence
   * @params {string} key - med key
   * @TODO check for the last occurrence
   */
  async function removeOccurrence(key: string) {
    try {
      const med = await db.get(`med-${key}`)
      if (med.occurrences > 1) {
        await db.upsert(`med-${key}`, () => ({ ...med, occurrences: med.occurrences - 1 }))
      }
    } catch (err) {
      console.error("remove med occurrence error: ", err)
      throw err
    }
  }

  return { resetDB, updates, medUpdate, getMeds, getMed, addMed, addOccurrence, removeOccurrence }
})
