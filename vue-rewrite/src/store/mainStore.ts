import { IBackup, ISettings, ISymptom, Languages, TimeFormats } from "@/types"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { useDayStore } from "./day"
import useSymptomStore from "./symptom"

const settingsDefault: ISettings = {
  defaultSymptom: "none",
  language: Languages.EN,
  timeFormat: TimeFormats.h24,
}

export const useMainStore = defineStore("main", () => {
  // External Components
  const { locale } = useI18n()
  const dayStore = useDayStore()
  const symptomStore = useSymptomStore()

  // Variables
  const db = new PouchDB<ISettings | IBackup>("main")
  const settingsDocId = "settings"
  const backupDocId = "backup"
  const initalised = ref(false)
  const settings = ref<ISettings>(settingsDefault)

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

  /**
   * Generates a backup
   * @returns {Promise<IBackup>} backup
   */
  async function generateBackup(): Promise<IBackup> {
    const backup: IBackup = {
      days: await dayStore.getAllDays(),
      symptoms: await symptomStore.getSymptoms(),
      settings: settings.value,
    }
    db.upsert(backupDocId, () => backup)
    return backup
  }

  return { settings, initalised, setDefaultSymptom, setLanguage, setTimeFormat, generateBackup }
})
