<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { format, parse } from "date-fns"
import { useDayStore } from "@/store"
import { buildNote, createToast, randomNumber } from "@/utils"
import { onBeforeMount, ref } from "vue"
import { INoteBasic, INoteLog, INoteOverview } from "@/types/note"
import { useNoteStore } from "@/store/note"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
  editData?: INoteOverview
}>()
const visible = defineModel<boolean>("visible")

// external components
const { t } = useI18n()
const dayStore = useDayStore()
const noteStore = useNoteStore()

// Variables
const monthShort = ref(format(new Date(props.day), "MMM"))
const day = ref(format(new Date(props.day), "dd"))
const noteListItems = ref<INoteBasic[]>([])
const noteSuggestions = ref<INoteBasic[]>([])

// Form values
const time = ref(new Date())
const selectedNote = ref<INoteBasic>()
const details = ref("")

// Functions
/**
 * Searches for notes in the note list and updates the suggestions
 * @param event - event given by the autocomplete
 */
function searchNotes(event: { originalEvent: Event; query: string }): void {
  noteSuggestions.value = noteListItems.value.filter(note => note.key.toLowerCase().includes(event.query.toLowerCase()))
}

/**
 * Adds a note to the db
 */
async function addNoteToDay() {
  if (selectedNote.value == undefined) {
    await createToast(t("FORM_REQUIRED", { field_name: t("NAME"), data_type: t("NOTE") }), 2000, "error")
    return
  }

  // Create not if it doesn't exist
  let iNoteBasic: INoteBasic = selectedNote.value
  if (typeof selectedNote.value === "string") {
    iNoteBasic = buildNote(selectedNote.value)
    await noteStore.addNote(iNoteBasic)
  }

  let iNoteLog: INoteLog
  console.log("props.editData: ", props.editData)
  if (props.editData) {
    iNoteLog = { key: props.editData.logKey, time: format(time.value, "HH:mm"), detail: details.value }
    console.log("iNoteLog: ", iNoteLog)
  } else {
    iNoteLog = { key: randomNumber(), time: format(time.value, "HH:mm"), detail: details.value }
  }

  dayStore
    .addNote(props.day, iNoteBasic, iNoteLog)
    .then(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("ADD"),
          successfully_failuar: t("SUCCESSFULLY"),
          data_type: t("NOTE"),
          name: iNoteBasic.key,
        }),
        2000,
        "success"
      )
      emits("close")
    })
    .catch(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("ADD"),
          successfully_failuar: t("FAILED"),
          data_type: t("NOTE"),
          name: iNoteBasic.key,
        }),
        2000,
        "error"
      )
    })
}

/**
 * Updates the note list
 */
async function updateNoteList() {
  const notes = await noteStore.getNotes()

  noteListItems.value = notes
}

// Init
onBeforeMount(() => {
  updateNoteList()

  // Subscribe to store changes
  noteStore.$subscribe(() => {
    updateNoteList()
  })

  // When editing a note, set the values
  if (props.editData !== undefined) {
    time.value = parse(props.editData.time, "HH:mm", new Date())
    // @ts-expect-error - Giving the note key to the autocomplete also works
    selectedNote.value = props.editData.key
    details.value = props.editData.detail
  }
})
</script>

<template>
  <PrimeDialog v-model:visible="visible" :closable="false" :draggable="false" modal>
    <template #header>
      <h3 class="text-2xl">
        {{ t(editData ? "EDIT_EVENT_DIALOG_TITLE" : "ADD_EVENT_DIALOG_TITLE", { type: t("NOTE"), monthShort, day }) }}
      </h3>
    </template>
    <form class="flex flex-col gap-8">
      <FloatLabel class="mt-6">
        <DatePicker v-model="time" time-only id="time" />
        <label for="time">{{ t("TIME") }}</label>
      </FloatLabel>
      <FloatLabel>
        <AutoComplete
          id="noteLabel"
          v-model="selectedNote"
          :suggestions="noteSuggestions"
          option-label="key"
          :label="t('NOTE')"
          empty-search-message=""
          @complete="searchNotes"
        >
          <template #empty><div></div></template>
        </AutoComplete>
        <label for="noteLabel">{{ t("NOTE") }}</label>
      </FloatLabel>
      <FloatLabel>
        <InputText v-model="details" id="details" />
        <label for="details">{{ t("DETAIL") }}</label>
      </FloatLabel>
    </form>
    <template #footer>
      <div class="flex w-full flex-row justify-between">
        <PrimeButton @click="emits('close')">{{ t("CANCEL") }}</PrimeButton>
        <PrimeButton @click="addNoteToDay">{{ t(editData ? "EDIT" : "ADD") }}</PrimeButton>
      </div>
    </template>
  </PrimeDialog>
</template>
