import { ISymptom } from "@/types/symptom"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useSymptomStore = defineStore("symptom", () => {
  const db = new PouchDB<ISymptom>("symptoms")
  // number of updates
  let updates = ref(0)

  async function getSymptoms(): Promise<ISymptom[]> {
    return (await db.allDocs({ include_docs: true, descending: true })).rows.map(row => row.doc as ISymptom)
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

  return { updates, getSymptoms, createNewSymptom, editSymptom, deleteSymptom }
})

export default useSymptomStore
