import { IMedBasic } from "@/types/med"
import { NotFoundError, NotFoundErrors } from "@/utils"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useMedStore = defineStore("med", () => {
  const db = new PouchDB<IMedBasic>("meds")
  // create indexes
  db.createIndex({ index: { fields: ["key"] } })

  const updates = ref(0)
  const medUpdate = ref<string[]>([])

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

  return { updates, medUpdate, getMeds, getMed, addMed }
})
