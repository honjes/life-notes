<script setup lang="ts">
/**
 * Settings page
 * @TODO: make Expansion Panels transition smooth
 */
import { useSymptomStore, useMainStore } from "@/store"
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

// Functions
async function setDefaultSymptom(symptomKey: string) {
  const newDefaultSymptom = symptomList.value.find(s => s.key === symptomKey)
  if (newDefaultSymptom) {
    await mainStore.setDefaultSymptom(newDefaultSymptom)
  }
}

async function updateSymptomList() {
  const symptoms = await symptomStore.getSymptoms()
  symptomList.value = symptoms
}

// Init
onBeforeMount(() => {
  updateSymptomList()

  // Subscribe to store changes
  symptomStore.$subscribe(() => {
    updateSymptomList()
  })
  mainStore.$subscribe(() => {
    defaultSymptom.value = mainStore.settings.defaultSymptom
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
          <section name="symptoms" class="flex flex-row gap-2 w-full">
            <v-expansion-panels>
              <v-expansion-panel expand-icon="spa" collapse-icon="spa">
                <v-expansion-panel-title>
                  <div class="flex flex-row justify-between items-center w-full">
                    <div>{{ t("SETTINGS_SYMPTOMS_TITLE") }}</div>
                    <div>{{ t("SETTINGS_SYMPTOMS_SUBTITLE") }}</div>
                    <v-icon>spa</v-icon>
                  </div>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div class="flex flex-col gap-4">
                    <div>
                      <v-select
                        :items="symptomList"
                        item-value="key"
                        item-title="label"
                        v-model="defaultSymptom"
                        :label="t('DEFAULT_SYMPTOM_LABEL')"
                        hide-details
                        @update:model-value="setDefaultSymptom"
                      />
                    </div>
                    <v-btn variant="text" @click="router.push({ name: 'Symptom List' })">{{
                      t("SYMPTOM_MANAGE_LINK")
                    }}</v-btn>
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
