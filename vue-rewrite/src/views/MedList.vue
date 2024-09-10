<script setup lang="ts">
import { useMedStore } from "@/store"
import { IMedBasic } from "@/types"
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue"
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
  <ion-page>
    <ion-content>
      <ion-header>
        <ion-toolbar>
          <ion-title class="flex justify-center" size="large">{{ t("MEDS_TITLE") }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <v-table>
          <thead>
            <th class="p-4 text-left">{{ t("TABLE_MEDICINE") }}</th>
            <th class="p-4 text-left">{{ t("TABLE_DOSAGE") }}</th>
            <th class="p-4 text-left">{{ t("TABLE_OCCURRENCES") }}</th>
            <th class="p-4 text-left">{{ t("TABLE_LAST_ENTRY") }}</th>
          </thead>
          <tbody>
            <tr v-for="med in medListItems" :key="med.key">
              <td class="px-4 text-left">{{ med.key }}</td>
              <td class="px-4 text-left">{{ med.quantity }}mg</td>
              <td class="px-4 text-left">{{ med.occurrences }}</td>
              <td class="px-4 text-left">{{ med.lastEntry }}</td>
            </tr>
          </tbody>
        </v-table>
      </ion-content>
    </ion-content>
  </ion-page>
</template>
