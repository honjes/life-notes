<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { format } from "date-fns"
import { useDayStore } from "@/store"
import { buildNote, createToast, NotFoundError, randomNumber } from "@/utils"
import { onBeforeMount, ref } from "vue"
import { TimePicker } from "./Fields"
import { INoteBasic, INoteLog, INoteOverview } from "@/types/note"
import AutoComplete from "./Fields/AutoComplete.vue"
import { useNoteStore } from "@/store/note"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
  editData?: INoteOverview
}>()

// external components
const { t } = useI18n()
const dayStore = useDayStore()
const noteStore = useNoteStore()

// Variables
const monthShort = ref(format(new Date(props.day), "MMM"))
const day = ref(format(new Date(props.day), "dd"))
const noteListItems = ref<INoteBasic[]>([])

// Form values
const time = ref(format(new Date(), "HH:mm"))
const noteLabel = ref<string>("")
const details = ref("")

// Functions
/**
 * Adds a note to the db
 */
async function addNoteToDay() {
  if (noteLabel.value == undefined || noteLabel.value === "") {
    await createToast(t("FORM_REQUIRED", { field_name: t("NAME"), data_type: t("NOTE") }), 2000, "error")
    return
  }

  // check if note already exists
  let iLogBasic: INoteBasic
  try {
    iLogBasic = await noteStore.getNote(noteLabel.value)
  } catch (err: unknown) {
    // if it doesn't exist, add it
    if (err instanceof NotFoundError) {
      iLogBasic = buildNote(noteLabel.value)
      await noteStore.addNote(iLogBasic)
    } else {
      throw err
    }
  }
  let iLogLog: INoteLog
  if (props.editData) {
    iLogLog = { key: props.editData.logKey, time: time.value, detail: details.value }
  } else {
    iLogLog = { key: randomNumber(), time: time.value, detail: details.value }
  }

  dayStore
    .addNote(props.day, iLogBasic, iLogLog)
    .then(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("ADD"),
          successfully_failuar: t("SUCCESSFULLY"),
          data_type: t("NOTE"),
          name: noteLabel.value,
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
          name: noteLabel.value,
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
  if (props.editData) {
    time.value = props.editData.time
    noteLabel.value = props.editData.key
    details.value = props.editData.detail
  }
})
</script>

<template>
  <v-card-title>
    <h3 class="text-xl">
      {{ t(editData ? "EDIT_EVENT_DIALOG_TITLE" : "ADD_EVENT_DIALOG_TITLE", { type: t("NOTE"), monthShort, day }) }}
    </h3>
  </v-card-title>
  <v-card-text>
    <v-form class="flex flex-col gap-4">
      <TimePicker v-model="time" />
      <AutoComplete v-model="noteLabel" :label="t('NOTE')" :items="noteListItems" selectKey="key" selectValue="key" />
      <v-text-field v-model="details" :label="t('DETAIL')" hide-details />
    </v-form>
  </v-card-text>
  <v-card-actions props>
    <v-btn @click="emits('close')">{{ t("CANCEL") }}</v-btn>
    <v-spacer></v-spacer>
    <v-btn @click="addNoteToDay">{{ t("ADD") }}</v-btn>
  </v-card-actions>
</template>
