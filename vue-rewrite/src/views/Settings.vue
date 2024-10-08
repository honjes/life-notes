<script setup lang="ts">
/**
 * Settings page
 * @TODO make Expansion Panels transition smooth
 * @TODO style borders for backdrop and a nicer color
 * @TODO style the paddings of the expansion panels (expacially for import / export)
 */
import { useSymptomStore, useMainStore } from "@/store"
import { IBackup, ISymptom, Languages, TimeFormats } from "@/types"
import { IonContent } from "@ionic/vue"
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
const defaultSymptom = ref<ISymptom>()
const symptomList = ref<ISymptom[]>([])
const languageList = ref<{ lang: Languages; label: string }[]>([
  {
    lang: Languages.EN,
    label: t("ENGLISH"),
  },
  {
    lang: Languages.FR,
    label: t("FRENCH"),
  },
])
const selectedLanguage = ref<{ lang: Languages; label: string }>(
  languageList.value.find(l => l.lang === mainStore.settings.language) || languageList.value[0]
)
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
const selectedTimeFormat = ref<{ timeFormat: TimeFormats; label: string }>(
  timeFormatList.value.find(t => t.timeFormat === mainStore.settings.timeFormat) || timeFormatList.value[0]
)
const backup = ref<IBackup>()
const copied = ref(false)
// Modals
const importModal = ref(false)
const importType = ref<"auto" | "manual" | "web">("auto")
const exportModal = ref(false)

// Functions
async function setDefaultSymptom(newDefaultSymptom: ISymptom) {
  await mainStore.setDefaultSymptom(newDefaultSymptom)
}

/**
 * Update the app language
 * @param {string} language - language to set
 */
async function setLanguage(language: { lang: string; label: string }) {
  await mainStore.setLanguage(language.lang as Languages)
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
  const newLanguage = mainStore.settings.language
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
  selectedLanguage.value = languageList.value.find(l => l.lang === newLanguage) || languageList.value[0]
}

/**
 * Update the symptom list
 */
async function updateSymptomList() {
  const currentDefaultSymptom = mainStore.settings.defaultSymptom
  const symptoms = await symptomStore.getSymptoms()
  symptomList.value = symptoms
  defaultSymptom.value = symptoms.find(s => s.key === currentDefaultSymptom)
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
    // update settings on initalisation
    if (mainStore.initalised) {
      selectedLanguage.value =
        languageList.value.find(l => l.lang === mainStore.settings.language) || languageList.value[0]
      selectedTimeFormat.value =
        timeFormatList.value.find(t => t.timeFormat === mainStore.settings.timeFormat) || timeFormatList.value[0]
      defaultSymptom.value = symptomList.value.find(s => s.key === mainStore.settings.defaultSymptom)
      unsubscribe()
    }
  })
})
</script>

<template>
  <ion-content>
    <div class="flex flex-col gap-6 px-4">
      <h1 class="my-4 text-3xl"><p>Settings</p></h1>
      <section name="symptoms" class="w-full">
        <Accordion value="0">
          <AccordionPanel name="symptoms" value="0">
            <AccordionHeader>
              <div class="flex w-full flex-row items-center">
                <div class="w-2/5">{{ t("SETTINGS_SYMPTOMS_TITLE") }}</div>
                <div>{{ t("SETTINGS_SYMPTOMS_SUBTITLE") }}</div>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-4">
                <FloatLabel class="width-full mt-6">
                  <PrimeSelect
                    v-model="defaultSymptom"
                    :options="symptomList"
                    option-label="label"
                    @update:model-value="setDefaultSymptom"
                    class="w-full"
                  />
                  <label for="defaultSymptom">{{ t("DEFAULT_SYMPTOM_LABEL") }}</label>
                </FloatLabel>
                <PrimeButton @click="router.push({ name: 'Symptoms' })">{{ t("SYMPTOM_MANAGE_LINK") }}</PrimeButton>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel name="meds" value="1">
            <AccordionHeader>
              <div class="flex w-full flex-row">
                <div class="w-2/5">{{ t("SETTINGS_MEDS_TITLE") }}</div>
                <div>{{ t("SETTINGS_MEDS_SUBTITLE") }}</div>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-4">
                <PrimeButton @click="router.push({ name: 'Meds' })">{{ t("MEDS_MANAGE_LINK") }}</PrimeButton>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel name="notes" value="2">
            <AccordionHeader>
              <div class="flex w-full flex-row items-center">
                <div class="w-2/5">{{ t("SETTINGS_NOTES_TITLE") }}</div>
                <div>{{ t("SETTINGS_NOTES_SUBTITLE") }}</div>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-4">
                <PrimeButton @click="router.push({ name: 'Notes' })">{{ t("NOTES_MANAGE_LINK") }}</PrimeButton>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel name="language" value="3">
            <AccordionHeader>
              <div class="flex w-full flex-row items-center">
                <div class="w-2/5">{{ t("SETTINGS_LANGUAGE_TITLE") }}</div>
                <div>{{ t("SETTINGS_LANGUAGE_SUBTITLE") }}</div>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-4">
                <FloatLabel class="mt-6">
                  <PrimeSelect
                    id="language"
                    class="w-full"
                    :options="languageList"
                    option-label="label"
                    v-model="selectedLanguage"
                    @update:model-value="setLanguage"
                  />
                  <label for="language">{{ t("LANGUAGE") }}</label>
                </FloatLabel>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel name="Time" value="4">
            <AccordionHeader>
              <div class="flex w-full flex-row items-center">
                <div class="w-2/5">{{ t("SETTINGS_TIME_TITLE") }}</div>
                <div>{{ t("SETTINGS_TIME_SUBTITLE") }}</div>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-4">
                <FloatLabel class="mt-6">
                  <PrimeSelect
                    id="timeFormat"
                    class="w-full"
                    :options="timeFormatList"
                    option-label="timeFormat"
                    v-model="selectedTimeFormat"
                    @update:model-value="setTimeFormat"
                  />
                  <label for="timeFormat">{{ t("TIME_FORMAT") }}</label>
                </FloatLabel>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel name="Import / Export" value="5">
            <AccordionHeader>
              <div class="flex w-full flex-row items-center">
                <div class="w-2/5">{{ t("SETTINGS_IMPORT_EXPORT_TITLE") }}</div>
                <div>{{ t("SETTINGS_IMPORT_EXPORT_SUBTITLE") }}</div>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <div class="flex flex-col gap-4">
                <div>
                  <Panel toggleable collapsed>
                    <template #header>
                      <div class="flex flex-row items-center gap-2">
                        <i class="material-icons !text-2xl">library_add</i>
                        {{ t("IMPORT") }}
                      </div>
                    </template>
                    <div class="flex flex-col gap-4">
                      <PrimeButton @click="openImportDialog('auto')">
                        {{ t("LOAD_AUTO_SAVE") }}
                      </PrimeButton>
                      <PrimeButton @click="openImportDialog('manual')">
                        {{ t("LOAD_MANUAL_SAVE") }}
                      </PrimeButton>
                      <PrimeButton @click="openImportDialog('web')">
                        {{ t("LOAD_WEB_SAVE") }}
                      </PrimeButton>
                    </div>
                  </Panel>
                </div>
                <PrimeButton class="w-full" @click="exportModal = true">
                  <i class="material-icons !text-2xl">save_alt</i>{{ t("SAVE") }}
                </PrimeButton>
              </div>
            </AccordionContent>
          </AccordionPanel>
          <AccordionPanel name="Advanced" value="6">
            <AccordionHeader>
              <div class="flex w-full flex-row items-center">
                <div class="flex w-full flex-row items-center">
                  <div class="w-2/5">{{ t("SETTINGS_ADVANCED_TITLE") }}</div>
                  <div>{{ t("SETTINGS_ADVANCED_SUBTITLE") }}</div>
                </div>
              </div>
            </AccordionHeader>
            <AccordionContent>
              <Accordion value="0">
                <AccordionPanel value="0">
                  <AccordionHeader>
                    <div class="flex w-full flex-row items-center">
                      <div class="w-2/5">{{ t("SETTINGS_MANUAL_SAVE_TITLE") }}</div>
                      <div>{{ t("SETTINGS_MANUAL_SAVE_SUBTITLE") }}</div>
                    </div>
                  </AccordionHeader>
                  <AccordionContent>
                    <div class="flex flex-col gap-4">
                      <PrimeButton @click="generateBackup()">
                        {{ t("SETTINGS_MANUAL_SAVE_BUTTON") }}
                      </PrimeButton>
                      <div v-if="backup" class="flex flex-col gap-4">
                        <PrimeButton @click="writeBackupToClipboard()">
                          <i class="material-icons">file_copy</i> {{ copied ? t("COPIED") : t("COPY") }}
                        </PrimeButton>
                        <div class="h-48 overflow-y-auto">
                          {{ backup }}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionPanel>
                <AccordionPanel value="1">
                  <AccordionHeader>
                    <div class="flex w-full flex-row items-center">
                      <div class="w-2/5">{{ t("SETTINGS_ERROR_LOGS_TITLE") }}</div>
                      <div>{{ t("SETTINGS_ERROR_LOGS_SUBTITLE") }}</div>
                    </div>
                  </AccordionHeader>
                  <AccordionContent>
                    <div v-if="errorLogs.length === 0" class="flex flex-row justify-center px-4">
                      {{ t("NO_ERROR_LOGS") }}
                    </div>
                    <div v-else class="flex flex-col gap-4">
                      <div v-for="error in errorLogs" :key="error">{{ error }}</div>
                    </div>
                  </AccordionContent>
                </AccordionPanel>
              </Accordion>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </section>
    </div>
  </ion-content>
  <PrimeDialog v-model:visible="importModal" :closable="false" :draggable="false" modal>
    <template #header>
      <h3 class="text-xl">
        {{ t("IMPORT_DIALOG_TITLE") }}
      </h3>
    </template>
    <p>{{ t("IMPORT_DIALOG_CONTENT_1") }}</p>
    <p>{{ t("IMPORT_DIALOG_CONTENT_2") }}</p>
    <p>{{ t("IMPORT_DIALOG_CONTENT_3") }}</p>
    <template #footer>
      <div class="flex w-full flex-row justify-between">
        <PrimeButton @click="importModal = false">{{ t("NO") }}</PrimeButton>
        <PrimeButton @click="importSave">{{ t("YES") }}</PrimeButton>
      </div>
    </template>
  </PrimeDialog>
  <PrimeDialog v-model:visible="exportModal" :closable="false" :draggable="false" modal>
    <template #header>
      <h3 class="text-xl">
        {{ t("EXPORT_DIALOG_TITLE", { data_type: t("SYMPTOMS") }) }}
      </h3>
    </template>
    <p>{{ t("EXPORT_DIALOG_CONTENT_1") }}</p>
    <p>{{ t("EXPORT_DIALOG_CONTENT_2") }}</p>
    <template #footer>
      <div class="flex w-full flex-row justify-between">
        <PrimeButton @click="exportModal = false">{{ t("NO") }}</PrimeButton>
        <PrimeButton @click="exportSave">{{ t("YES") }}</PrimeButton>
      </div>
    </template>
  </PrimeDialog>
</template>

<style lang="scss">
.pannel-style {
  padding: var(--p-panel-toggleable-header-padding);
  border-style: solid;
  border: 1px solid var(--p-panel-border-color);
  border-color: var(--p-panel-header-border-color);
  border-radius: var(--p-panel-border-radius);
}
</style>
