<script setup lang="ts">
import { useMedStore } from "@/store"
import { IMedBasic } from "@/types"
import { IonContent } from "@ionic/vue"
import { onBeforeMount, ref } from "vue"
import { useI18n } from "vue-i18n"

// External Components
const medStore = useMedStore()
const { t } = useI18n()

// Variables
const medListItems = ref<IMedBasic[]>([])

/**
 * Updates the med list
 */
async function updateMedList() {
  const meds = await medStore.getMeds()
  medListItems.value = meds.sort((a, b) => b.occurrences - a.occurrences)
}

// Initalise note list
onBeforeMount(() => {
  updateMedList()

  // Subscribe to store changes and update note list
  medStore.$subscribe(() => {
    updateMedList()
  })
})
</script>

<template>
  <ion-content>
    <div class="flex flex-col gap-6 px-4">
      <h1 class="my-4 text-3xl">{{ t("MEDS_TITLE") }}</h1>
      <DataTable :value="medListItems">
        <Column field="key" :header="t('TABLE_MEDICINE')" />
        <Column field="quantity" :header="t('TABLE_DOSAGE')" />
        <Column field="occurrences" :header="t('TABLE_OCCURRENCES')" />
        <Column field="lastEntry" :header="t('TABLE_LAST_ENTRY')" />
      </DataTable>
    </div>
  </ion-content>
</template>
