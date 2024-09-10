import { ISettings, ISymptom, Languages, TimeFormats } from "@/types"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useI18n } from "vue-i18n"

const settingsDefault: ISettings = {
  defaultSymptom: "none",
  language: Languages.EN,
  timeFormat: TimeFormats.h24,
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

  /**
   * sets the time format
   * @param {TimeFormats} timeFormat - time format to set
   */
  async function setTimeFormat(timeFormat: TimeFormats) {
    settings.value.timeFormat = timeFormat

    await updateSettings()
  }

  return { settings, initalised, setDefaultSymptom, setLanguage, setTimeFormat }
})
