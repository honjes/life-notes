import { ISymptom } from "@/types/symptom"
import { defineStore } from "pinia"

export const useSymptomStore = defineStore("symptom", () => {
  const db = new PouchDB<ISymptom>("symptoms")

  async function getSymptoms(): Promise<ISymptom[]> {
    return (await db.allDocs({ include_docs: true, descending: true })).rows.map(row => row.doc as ISymptom)
  }

  return { getSymptoms }
})

export default useSymptomStore
