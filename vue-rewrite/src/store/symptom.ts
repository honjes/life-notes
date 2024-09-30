import { ISymptom } from "@/types/symptom"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useSymptomStore = defineStore("symptom", () => {
  let db = new PouchDB<ISymptom>("symptoms")
  // create indexes
  db.createIndex({ index: { fields: ["label"] } })
  // number of updates
  const updates = ref(0)

  /**
   * Initalise symptom DB with given data
   * !!! This will delete all data in the DB !!!
   * @param {ISymptom[]} data - data to initalise DB with
   */
  async function resetDB(data: ISymptom[]): Promise<void> {
    await db.destroy()
    db = new PouchDB<ISymptom>("symptoms")
    await db.bulkDocs(data)
  }

  /**
   * returns all symptoms
   * @returns Promise<ISymptom[]>
   */
  async function getSymptoms(): Promise<ISymptom[]> {
    return (
      (await db.allDocs({ include_docs: true, descending: true })).rows
        .map(row => row.doc as ISymptom)
        // @ts-expect-error - ignore rows that include language (probably the index reference of the db)
        .filter(s => s.language !== "query")
    )
  }

  /**
   * returns a symptom by labe
   * @param label - symptom label
   * @returns Promise<ISymptom>
   */
  async function getSymptomByLabel(label: string): Promise<ISymptom> {
    const symptomReturn = await db.find({ selector: { label: { $eq: label } } })
    if (symptomReturn.docs.length === 0) throw new Error("Symptom not found")
    return symptomReturn.docs[0]
  }

  /**
   * Creates a new symptom
   * @param name - symptom name
   * @TODO check if with name already exists
   */
  async function createNewSymptom(name: string) {
    const newSymptom: PouchDB.Core.PutDocument<ISymptom & { _id: string; key: string; label: string }> = {
      _id: `symptom-${name}`,
      key: `symptom-${name}`,
      label: name,
      logs: [],
    }
    updates.value++
    return await db.put(newSymptom)
  }

  /**
   * Edits the name of a symptom
   * @param key - symptom key
   * @param name - new name
   */
  async function editSymptom(key: string, name: string) {
    if (key == null || key === "") throw new Error("key is required")
    const symptom = await db.get(key)
    symptom.label = name
    updates.value++
    return await db.put(symptom)
  }

  /**
   * Deletes a symptom
   * @param key - symptom key
   */
  async function deleteSymptom(key: string) {
    if (key == null || key === "") throw new Error("key is required")
    const symptom = await db.get(key)
    updates.value++
    return await db.remove(symptom)
  }

  return { resetDB, updates, getSymptoms, getSymptomByLabel, createNewSymptom, editSymptom, deleteSymptom }
})

export default useSymptomStore
