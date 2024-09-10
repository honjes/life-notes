<script setup lang="ts">
import { useNoteStore } from "@/store"
import { INoteBasic } from "@/types"
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue"
import { onBeforeMount, ref } from "vue"
import { useI18n } from "vue-i18n"

// External Components
const noteStore = useNoteStore()
const { t } = useI18n()

// Variables
const notesListItems = ref<INoteBasic[]>([])

/**
 * Updates the note list
 */
async function updateNoteList() {
  const notes = await noteStore.getNotes()
  notesListItems.value = notes
}

// Initalise note list
onBeforeMount(() => {
  updateNoteList()

  // Subscribe to store changes and update note list
  noteStore.$subscribe(() => {
    updateNoteList()
  })
})
</script>

<template>
  <ion-page>
    <ion-content>
      <ion-header>
        <ion-toolbar>
          <ion-title class="flex justify-center" size="large">{{ t("NOTES_TITLE") }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <v-table>
          <thead>
            <th class="p-4 text-left">{{ t("TABLE_NOTE") }}</th>
            <th class="p-4 text-left">{{ t("TABLE_OCCURRENCES") }}</th>
            <th class="p-4 text-left">{{ t("TABLE_LAST_ENTRY") }}</th>
          </thead>
          <tbody>
            <tr v-for="note in notesListItems" :key="note.key">
              <td class="px-4 text-left">{{ note.key }}</td>
              <td class="px-4 text-left">{{ note.occurrences }}</td>
              <td class="px-4 text-left">{{ note.lastEntry }}</td>
            </tr>
          </tbody>
        </v-table>
      </ion-content>
    </ion-content>
  </ion-page>
</template>
