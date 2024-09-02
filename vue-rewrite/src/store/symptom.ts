import { ISymptom } from "@/types/symptom"
import { defineStore } from "pinia"

export const useSymptomStore = defineStore("symptom", () => {
  const db = new PouchDB<ISymptom>("symptoms")

  async function getSymptoms(): Promise<ISymptom[]> {
    return (await db.allDocs({ include_docs: true, descending: true })).rows.map(row => row.doc as ISymptom)
  }

  async function createNewSymptom(name: string) {
    const newSymptom: PouchDB.Core.PutDocument<ISymptom & { _id: string; key: string; label: string }> = {
      _id: `symptom-${name}`,
      key: `symptom-${name}`,
      label: name,
      logs: [],
    }
    return await db.put(newSymptom)
  }

  return { getSymptoms, createNewSymptom }
})

export default useSymptomStore
