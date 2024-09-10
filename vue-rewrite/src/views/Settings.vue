<script setup lang="ts">
/**
 * Settings page
 * @TODO make Expansion Panels transition smooth
 * @TODO style borders for backdrop and a nicer color
 */
import { useSymptomStore, useMainStore, Languages } from "@/store"
import { ISymptom } from "@/types"
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue"
import { onBeforeMount, ref } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

// External Components
const { t } = useI18n()
const router = useRouter()
const symptomStore = useSymptomStore()
const mainStore = useMainStore()

// Variables
const defaultSymptom = ref<string>(mainStore.settings.defaultSymptom)
const symptomList = ref<ISymptom[]>([])
const selectedLanguage = ref<string>(mainStore.settings.language)
const languageList = ref<{ lang: Languages; label: string }[]>([])

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
      unsubscribe()
    }
  })
})
</script>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title class="text-white"><p>Settings</p></ion-title>
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
            </v-expansion-panels>
          </section>
        </div>
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<style lang="scss">
.v-expansion-panel-title__icon {
  display: none;
}
</style>
