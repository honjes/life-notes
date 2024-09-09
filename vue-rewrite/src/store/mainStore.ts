import { ISymptom } from "@/types"
import { defineStore } from "pinia"
import { ref } from "vue"

export interface ISettings {
  defaultSymptom: string
}

const settingsDefault: ISettings = {
  defaultSymptom: "none",
}

export const useMainStore = defineStore("main", () => {
  const db = new PouchDB<ISettings>("main")

  const settingsDocId = "settings"
  const settings = ref<ISettings>(settingsDefault)

  // init settings
  db.get<ISettings>(settingsDocId)
    .then(settingsResponse => {
      if (settingsResponse) {
        settings.value.defaultSymptom = settingsResponse.defaultSymptom || "none"
      }
    })
    .catch(_ => {
      updateSettings()
    })

  async function updateSettings() {
    try {
      await db.upsert(settingsDocId, () => ({ ...settings.value }))
    } catch (err) {
      console.error("update settings error: ", err)
      throw err
    }
  }

  /**
   * sets the default Symptom
   * @param {ISymptom} symptom - symptom to set as default
   */
  async function setDefaultSymptom(symptom: ISymptom) {
    settings.value.defaultSymptom = symptom.key
    await updateSettings()
  }

  return { settings, setDefaultSymptom }
})
