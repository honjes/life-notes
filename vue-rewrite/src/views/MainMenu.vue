<script setup lang="ts">
/*
 * Header on each page
 */
import { useMainStore, useSymptomStore } from "@/store"
import { ISymptom } from "@/types"
import { IonHeader, useIonRouter } from "@ionic/vue"
import { storeToRefs } from "pinia"
import { onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"

// External Components
const { t } = useI18n()
const mainStore = useMainStore()
const symptomStore = useSymptomStore()

// variables
const { settings } = storeToRefs(mainStore)
const symptomList = ref<ISymptom[]>([])
const mainSymptom = ref<ISymptom>()

// Styling
const MenuButton = ref({
  paddingY: "0rem",
  paddingX: "0.6rem",
})

const MenuSelect = ref({
  background: "transparent",
  borderColor: "transparent",
  dropdownColor: "{surface-50}",
  shadow: "none",
  paddingX: "0",
})

const router = useIonRouter()

// functions
/**
 * update the default symptom in store
 */
async function setDefaultSymptom() {
  mainStore.setDefaultSymptom(mainSymptom.value as ISymptom)
}

// initalisation
onMounted(async () => {
  if (settings.value.defaultSymptom) {
    mainSymptom.value = settings.value.defaultSymptom
  }
  symptomList.value = await symptomStore.getSymptoms()

  mainStore.$subscribe(async () => {
    if (settings.value.defaultSymptom) {
      mainSymptom.value = settings.value.defaultSymptom
    }
  })
})
</script>

<template>
  <IonHeader>
    <!-- eslint-disable vue/no-deprecated-slot-attribute -->
    <div class="bg-surface-50 dark:bg-surface-700 flex w-full flex-row justify-between p-5">
      <div class="flex w-8/12 flex-row">
        <PrimeButton :dt="MenuButton" link>
          <i class="material-icons" @click="router.push({ name: 'Home' })"> calendar_view_day </i>
        </PrimeButton>
        <PrimeButton :dt="MenuButton" link>
          <i class="material-icons" @click="router.push({ name: 'Calendar' })"> apps </i>
        </PrimeButton>
        <PrimeSelect
          :dt="MenuSelect"
          class="w-full flex-row-reverse"
          v-model="mainSymptom"
          :options="symptomList"
          optionLabel="label"
          labelClass="max-w-28"
          :placeholder="t('NO_DEFAULT_SYMPTOM')"
          @change="setDefaultSymptom"
        >
          <template #dropdownicon>
            <i class="material-icons"> spa </i>
          </template>
        </PrimeSelect>
      </div>
      <div class="flex flex-row">
        <PrimeButton :dt="MenuButton" link>
          <i class="material-icons" @click="router.push({ name: 'Help' })">help</i>
        </PrimeButton>
        <PrimeButton :dt="MenuButton" link>
          <i class="material-icons" @click="router.push({ name: 'Settings' })">settings</i>
        </PrimeButton>
      </div>
    </div>
  </IonHeader>
</template>
