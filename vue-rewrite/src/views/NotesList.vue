<script setup lang="ts">
import { useNoteStore } from "@/store"
import { INoteBasic } from "@/types"
import { IonContent } from "@ionic/vue"
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
  <ion-content>
    <div class="flex flex-col gap-6 px-4">
      <h1 class="my-4 text-3xl">{{ t("NOTES_TITLE") }}</h1>
      <DataTable :value="notesListItems">
        <Column field="key" :header="t('TABLE_NOTE')" />
        <Column field="occurrences" :header="t('TABLE_OCCURRENCES')" />
        <Column field="lastEntry" :header="t('TABLE_LAST_ENTRY')" />
      </DataTable>
    </div>
  </ion-content>
</template>
