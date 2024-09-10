import { ISymptom } from "@/types"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useI18n } from "vue-i18n"

export enum Languages {
  FR = "fr",
  EN = "en",
}

export interface ISettings {
  defaultSymptom: string
  language: Languages
}

const settingsDefault: ISettings = {
  defaultSymptom: "none",
  language: Languages.EN,
}

export const useMainStore = defineStore("main", () => {
  const db = new PouchDB<ISettings>("main")

  const settingsDocId = "settings"
  const initalised = ref(false)
  const settings = ref<ISettings>(settingsDefault)
  const { locale } = useI18n()

  // init settings
  db.get<ISettings>(settingsDocId)
    .then(settingsResponse => {
      if (settingsResponse) {
        settings.value = settingsResponse
        locale.value = settings.value.language
      }
      initalised.value = true
    })
    .catch(_ => {
      initalised.value = true
      // save default settings to db
      updateSettings()
    })

  async function updateSettings() {
    try {
      console.log("update settings: ", settings.value)
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

  /**
   * sets the language
   * @param {Languages} language - language to set
   */
  async function setLanguage(language: Languages) {
    settings.value.language = language
    locale.value = language

    await updateSettings()
  }

  return { settings, initalised, setDefaultSymptom, setLanguage }
})
