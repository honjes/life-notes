<script setup lang="ts">
/**
 * Settings page
 * @TODO make Expansion Panels transition smooth
 * @TODO style borders for backdrop and a nicer color
 * @TODO style the paddings of the expansion panels (expacially for import / export)
 */
import { useSymptomStore, useMainStore } from "@/store"
import { IBackup, ISymptom, Languages, TimeFormats } from "@/types"
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue"
import { storeToRefs } from "pinia"
import { onBeforeMount, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"
import { Clipboard } from "@capacitor/clipboard"
import { createToast } from "@/utils"
import { FilePicker } from "@capawesome/capacitor-file-picker"

// External Components
const { t } = useI18n()
const router = useRouter()
const symptomStore = useSymptomStore()
const mainStore = useMainStore()
const { errorLogs } = storeToRefs(mainStore)

// Variables
const defaultSymptom = ref<string>(mainStore.settings.defaultSymptom)
const symptomList = ref<ISymptom[]>([])
const selectedLanguage = ref<string>(mainStore.settings.language)
const languageList = ref<{ lang: Languages; label: string }[]>([])
const selectedTimeFormat = ref<string>(mainStore.settings.timeFormat)
const timeFormatList = ref<{ timeFormat: TimeFormats; label: string }[]>([
  {
    timeFormat: TimeFormats.h24,
    label: t("24H"),
  },
  {
    timeFormat: TimeFormats.h12,
    label: t("12H"),
  },
])
const backup = ref<IBackup>()
const copied = ref(false)
// Modals
const importModal = ref(false)
const importType = ref<"auto" | "manual" | "web">("auto")
const exportModal = ref(false)

// Functions
async function setDefaultSymptom(symptomKey: string) {
  const newDefaultSymptom = symptomList.value.find(s => s.key === symptomKey)
  if (newDefaultSymptom) {
    await mainStore.setDefaultSymptom(newDefaultSymptom)
  }
}

/**
 * Update the app language
 * @param {string} language - language to set
 */
async function setLanguage(language: string) {
  await mainStore.setLanguage(language as Languages)
  updateLanguageList()
}

/**
 * Update the time format
 * @param {string} timeFormat - time format to set
 */
async function setTimeFormat(timeFormat: string) {
  await mainStore.setTimeFormat(timeFormat as TimeFormats)
}

/**
 * Update the language list
 */
function updateLanguageList() {
  languageList.value = [
    {
      lang: Languages.FR,
      label: t("FRENCH"),
    },
    {
      lang: Languages.EN,
      label: t("ENGLISH"),
    },
  ]
}

/**
 * Update the symptom list
 */
async function updateSymptomList() {
  const symptoms = await symptomStore.getSymptoms()
  symptomList.value = symptoms
}

/**
 * Opens the import dialog
 * @param {"auto" | "manual"} type - type of import
 */
function openImportDialog(type: "auto" | "manual" | "web") {
  importType.value = type
  importModal.value = true
}

/**
 * Imports a save
 */
async function importSave() {
  if (importType.value === "auto") {
    mainStore.loadBackup("auto")
  } else if (importType.value === "manual") {
    mainStore.loadBackup("manual")
  } else {
    await FilePicker.pickFiles({
      limit: 1,
    })
      .then(async res => {
        if (res.files.length === 0) {
          mainStore.addErrorLog("No file selected")
          return
        }
        const file = res.files[0]
        if (file.path) {
          mainStore.loadBackup(file.path)
        }
      })
      .catch(err => {
        console.error("import save error: ", err)
        mainStore.addErrorLog(err)
      })
  }
  importModal.value = false
}

/**
 * Exports a save
 */
async function exportSave() {
  try {
    await mainStore.saveBackup("manual")
    exportModal.value = false
    createToast(t("DATA_EXPORT_SNACKBAR_SUCCESS"), 2000, "success")
  } catch (_) {
    createToast(t("DATA_EXPORT_SNACKBAR_ERROR"), 2000, "error")
  }
}

/**
 * Generates a backup
 */
async function generateBackup() {
  backup.value = await mainStore.generateBackup()
}

/**
 * Writes the backup to the clipboard
 */
async function writeBackupToClipboard() {
  await Clipboard.write({
    string: JSON.stringify(backup.value),
  })
  copied.value = true
}

// Init
onBeforeMount(() => {
  updateLanguageList()
  updateSymptomList()

  // Subscribe to store changes
  symptomStore.$subscribe(() => {
    updateSymptomList()
  })
  // only subscribe until initalised
  const unsubscribe = mainStore.$subscribe(() => {
    if (mainStore.initalised) {
      defaultSymptom.value = mainStore.settings.defaultSymptom
      selectedLanguage.value = mainStore.settings.language
      selectedTimeFormat.value = mainStore.settings.timeFormat
      unsubscribe()
    }
  })
})
</script>

<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-title class="dark:text-white"><p>Settings</p></ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-content>
        <div>
          <section name="symptoms" class="w-full">
            <v-expansion-panels>
              <v-expansion-panel class="border-y-2 border-gray-600">
                <v-expansion-panel-title>
                  <div class="flex flex-row items-center w-full">
                    <div class="w-full flex flex-row items-center">
                      <div class="w-2/5">{{ t("SETTINGS_SYMPTOMS_TITLE") }}</div>
                      <div>{{ t("SETTINGS_SYMPTOMS_SUBTITLE") }}</div>
                    </div>
                    <v-icon>spa</v-icon>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="flex flex-col gap-4">
                    <v-select
                      :items="symptomList"
                      item-value="key"
                      item-title="label"
                      v-model="defaultSymptom"
                      :label="t('DEFAULT_SYMPTOM_LABEL')"
                      hide-details
                      @update:model-value="setDefaultSymptom"
                    />
                    <v-btn variant="text" @click="router.push({ name: 'Symptoms' })">{{
                      t("SYMPTOM_MANAGE_LINK")
                    }}</v-btn>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel class="border-y-2 border-gray-600">
                <v-expansion-panel-title>
                  <div class="flex flex-row items-center w-full">
                    <div class="flex flex-row w-full">
                      <div class="w-2/5">{{ t("SETTINGS_MEDS_TITLE") }}</div>
                      <div>{{ t("SETTINGS_MEDS_SUBTITLE") }}</div>
                    </div>
                    <v-icon>medication</v-icon>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="flex flex-col gap-4">
                    <v-btn variant="text" @click="router.push({ name: 'Meds' })">{{ t("MEDS_MANAGE_LINK") }}</v-btn>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel class="border-y-2 border-gray-600">
                <v-expansion-panel-title>
                  <div class="flex flex-row items-center w-full">
                    <div class="flex flex-row items-center w-full">
                      <div class="w-2/5">{{ t("SETTINGS_NOTES_TITLE") }}</div>
                      <div>{{ t("SETTINGS_NOTES_SUBTITLE") }}</div>
                    </div>
                    <v-icon>event_note</v-icon>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="flex flex-col gap-4">
                    <v-btn variant="text" @click="router.push({ name: 'Notes' })">{{ t("NOTES_MANAGE_LINK") }}</v-btn>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel class="border-y-2 border-gray-600">
                <v-expansion-panel-title>
                  <div class="flex flex-row justify-between items-center w-full">
                    <div class="flex flex-row items-center w-full">
                      <div class="w-2/5">{{ t("SETTINGS_LANGUAGE_TITLE") }}</div>
                      <div>{{ t("SETTINGS_LANGUAGE_SUBTITLE") }}</div>
                    </div>
                    <v-icon>language</v-icon>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="flex flex-col gap-4">
                    <v-select
                      :items="languageList"
                      item-value="lang"
                      item-title="label"
                      v-model="selectedLanguage"
                      :label="t('LANGUAGE')"
                      hide-details
                      @update:model-value="setLanguage"
                    />
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel name="Time" class="border-y-2 border-gray-600">
                <v-expansion-panel-title>
                  <div class="flex flex-row justify-between items-center w-full">
                    <div class="flex flex-row items-center w-full">
                      <div class="w-2/5">{{ t("SETTINGS_TIME_TITLE") }}</div>
                      <div>{{ t("SETTINGS_TIME_SUBTITLE") }}</div>
                    </div>
                    <v-icon>access_time</v-icon>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="flex flex-col gap-4">
                    <v-select
                      :items="timeFormatList"
                      item-value="timeFormat"
                      item-title="label"
                      v-model="selectedTimeFormat"
                      :label="t('TIME_FORMAT')"
                      hide-details
                      @update:model-value="setTimeFormat"
                    />
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel name="Import / Export" class="border-y-2 border-gray-600">
                <v-expansion-panel-title>
                  <div class="flex flex-row justify-between items-center w-full">
                    <div class="flex flex-row items-center w-full">
                      <div class="w-2/5">{{ t("SETTINGS_IMPORT_EXPORT_TITLE") }}</div>
                      <div>{{ t("SETTINGS_IMPORT_EXPORT_SUBTITLE") }}</div>
                    </div>
                    <v-icon>swap_vert</v-icon>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-list>
                    <v-list-item>
                      <v-expansion-panels>
                        <v-expansion-panel>
                          <v-expansion-panel-title>
                            <div class="flex flex-row items-center gap-2">
                              <v-icon>library_add</v-icon>
                              {{ t("IMPORT") }}
                            </div>
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <v-list>
                              <v-list-item @click="openImportDialog('auto')">
                                {{ t("LOAD_AUTO_SAVE") }}
                              </v-list-item>
                              <v-list-item @click="openImportDialog('manual')">
                                {{ t("LOAD_MANUAL_SAVE") }}
                              </v-list-item>
                              <v-list-item @click="openImportDialog('web')">
                                {{ t("LOAD_WEB_SAVE") }}
                              </v-list-item>
                            </v-list>
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panels>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title class="flex flex-row items-center gap-2" @click="exportModal = true">
                        <v-icon>save_alt</v-icon>{{ t("SAVE") }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
              <v-expansion-panel name="Advanced" class="border-y-2 border-gray-600">
                <v-expansion-panel-title>
                  <div class="flex flex-row justify-between items-center w-full">
                    <div class="flex flex-row items-center w-full">
                      <div class="flex flex-row items-center w-full">
                        <div class="w-2/5">{{ t("SETTINGS_ADVANCED_TITLE") }}</div>
                        <div>{{ t("SETTINGS_ADVANCED_SUBTITLE") }}</div>
                      </div>
                      <v-icon>expand</v-icon>
                    </div>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <v-expansion-panels>
                    <v-expansion-panel class="border-y-2 border-gray-600">
                      <v-expansion-panel-title>
                        <div class="flex flex-row items-center w-full">
                          <div class="w-2/5">{{ t("SETTINGS_MANUAL_SAVE_TITLE") }}</div>
                          <div>{{ t("SETTINGS_MANUAL_SAVE_SUBTITLE") }}</div>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <div class="flex flex-col gap-4">
                          <v-btn class="text-center py-1 bg-blue-800 rounded" variant="tonal" @click="generateBackup()">
                            {{ t("SETTINGS_MANUAL_SAVE_BUTTON") }}
                          </v-btn>
                          <div v-if="backup" class="flex flex-col gap-4">
                            <v-btn @click="writeBackupToClipboard()"
                              ><v-icon>file_copy</v-icon> {{ copied ? t("COPIED") : t("COPY") }}</v-btn
                            >
                            <div class="overflow-y-auto h-32">
                              {{ backup }}
                            </div>
                          </div>
                        </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel class="border-y-2 border-gray-600">
                      <v-expansion-panel-title>
                        <div class="flex flex-row items-center w-full">
                          <div class="w-2/5">{{ t("SETTINGS_ERROR_LOGS_TITLE") }}</div>
                          <div>{{ t("SETTINGS_ERROR_LOGS_SUBTITLE") }}</div>
                        </div>
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <div v-if="errorLogs.length === 0" class="flex flex-row justify-center px-4">
                          {{ t("NO_ERROR_LOGS") }}
                        </div>
                        <div v-else class="flex flex-col gap-4">
                          <div v-for="error in errorLogs" :key="error">{{ error }}</div>
                        </div>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </section>
        </div>
      </ion-content>
    </ion-content>
  </ion-content>
  <v-dialog v-model="importModal" max-width="auto">
    <template v-slot:default>
      <v-card>
        <v-card-title>{{ t("IMPORT_DIALOG_TITLE") }}</v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <p>{{ t("IMPORT_DIALOG_CONTENT_1") }}</p>
          <p>{{ t("IMPORT_DIALOG_CONTENT_2") }}</p>
          <p>{{ t("IMPORT_DIALOG_CONTENT_3") }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="importModal = false">{{ t("NO") }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="importSave">{{ t("YES") }}</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
  <v-dialog v-model="exportModal" max-width="auto">
    <template v-slot:default>
      <v-card>
        <v-card-title>
          <h3 class="text-xl">
            {{ t("EXPORT_DIALOG_TITLE", { data_type: t("SYMPTOMS") }) }}
          </h3>
        </v-card-title>
        <v-card-text class="flex flex-col gap-4">
          <p>{{ t("EXPORT_DIALOG_CONTENT_1") }}</p>
          <p>{{ t("EXPORT_DIALOG_CONTENT_2") }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="text" @click="exportModal = false">{{ t("NO") }}</v-btn>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="exportSave">{{ t("YES") }}</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<style lang="scss">
.v-expansion-panel[name="Import / Export"] {
  .v-expansion-panel-text .v-expansion-panel-title {
    padding: 0;
  }
}

.v-expansion-panel-title__icon {
  display: none;
}
</style>
