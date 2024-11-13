import { IBackup, ISettings, ISymptom, Languages, TimeFormats } from "@/types"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { useDayStore } from "./day"
import { Directory, Encoding, Filesystem } from "@capacitor/filesystem"
import useSymptomStore from "./symptom"
import { useMedStore } from "./med"
import { useNoteStore } from "./note"
import { version } from "../../package.json"
import { createToast, generateInsertDataFromBackup } from "@/utils"

const settingsDefault: ISettings = {
  defaultSymptom: "none",
  language: Languages.EN,
  timeFormat: TimeFormats.h24,
  firstStart: true,
  lastInstall: new Date().toISOString(),
  painColors: {
    0: "var(--p-green-800)",
    1: "var(--p-green-500)",
    2: "var(--p-yellow-500)",
    3: "var(--p-yellow-800){yellow.800}",
    4: "var(--p-red-500)",
    5: "var(--p-red-950)",
  },
}

export const useMainStore = defineStore("main", () => {
  // External Components
  const { locale, t } = useI18n()
  const dayStore = useDayStore()
  const symptomStore = useSymptomStore()
  const medStore = useMedStore()
  const noteStore = useNoteStore()

  // Variables
  const db = new PouchDB<ISettings | IBackup>("main")
  const settingsDocId = "settings"
  const backupDocId = "backup"
  const initalised = ref(false)
  const settings = ref<ISettings>(settingsDefault)
  const errorLogs = ref<string[]>([])

  //TODO: check for permissions

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
      meds: await medStore.getMeds(),
      notes: await noteStore.getNotes(),
      settings: settings.value,
      version: version,
    }
    db.upsert(backupDocId, () => backup)
    return backup
  }

  /**
   * Save the backup to the filesystem
   */
  async function saveBackup(type: "auto" | "manual" = "auto") {
    const backup = await generateBackup()
    await Filesystem.writeFile({
      path: `${type === "auto" ? "autobackup" : "backup"}.json`,
      data: JSON.stringify(backup),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
      recursive: true,
    }).catch(err => {
      console.error("save backup error: ", err)
      addErrorLog(err.message)
      throw err
    })
  }

  /**
   * Imports a backup
   * @param {IBackup} backup - backup to import
   */
  async function importBackup(backup: IBackup) {
    try {
      const insertData = generateInsertDataFromBackup(backup)
      await dayStore.resetDB(insertData.days)
      await symptomStore.resetDB(insertData.symptoms)
      await medStore.resetDB(insertData.meds)
      await noteStore.resetDB(insertData.notes)
    } catch (err) {
      console.error("import backup error: ", err)
      addErrorLog(err as string)
      throw err
    }
  }

  /**
   * Loads a backup from the filesystem
   * @param {string} type - type of backup to load ("auto" or "manual") or path to backup
   */
  async function loadBackup(type: "auto" | "manual" | string) {
    if (type === "auto") {
      try {
        const backup = await Filesystem.readFile({
          path: "autobackup.json",
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        })
        if (backup) {
          const backupJson = JSON.parse(backup.data as string)
          await importBackup(backupJson)
          await createToast(t("DATA_IMPORT_SNACKBAR_SUCCESS"), 2000, "success")
        } else {
          await createToast(t("DATA_IMPORT_SNACKBAR_ERROR"), 2000, "error")
        }
      } catch (err) {
        //@ts-expect-error - //TODO: make more specific error for log
        addErrorLog(err)
        await createToast(t("DATA_IMPORT_SNACKBAR_ERROR"), 2000, "error")
      }
    } else if (type === "manual") {
      try {
        const backup = await Filesystem.readFile({
          path: "backup.json",
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        })
        if (backup) {
          const backupJson = JSON.parse(backup.data as string)
          await importBackup(backupJson)
          await createToast(t("DATA_IMPORT_SNACKBAR_SUCCESS"), 2000, "success")
        } else {
          await createToast(t("DATA_IMPORT_SNACKBAR_ERROR"), 2000, "error")
        }
      } catch (err) {
        //@ts-expect-error - //TODO: make more specific error for log
        addErrorLog(err)
        await createToast(t("DATA_IMPORT_SNACKBAR_ERROR"), 2000, "error")
      }
    } else {
      try {
        const backup = await Filesystem.readFile({
          path: type,
          encoding: Encoding.UTF8,
        })
        if (backup) {
          const backupJson = JSON.parse(backup.data as string)
          await importBackup(backupJson)
          await createToast(t("DATA_IMPORT_SNACKBAR_SUCCESS"), 2000, "success")
        } else {
          await createToast(t("DATA_IMPORT_SNACKBAR_ERROR"), 2000, "error")
        }
      } catch (err) {
        //@ts-expect-error - //TODO: make more specific error for log
        addErrorLog(err)
        await createToast(t("DATA_IMPORT_SNACKBAR_ERROR"), 2000, "error")
      }
    }
  }

  /**
   * Add a error log
   * @param {string} error - error to add
   */
  function addErrorLog(error: string) {
    errorLogs.value.push(error)
  }

  return {
    settings,
    initalised,
    setDefaultSymptom,
    setLanguage,
    setTimeFormat,
    generateBackup,
    saveBackup,
    loadBackup,
    errorLogs,
    addErrorLog,
  }
})
