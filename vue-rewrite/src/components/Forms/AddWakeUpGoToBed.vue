<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { format } from "date-fns"
import { useDayStore } from "@/store"
import { createToast } from "@/utils"
import { onBeforeMount, ref } from "vue"
import { TimePicker } from "./Fields"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
  wakeUp?: boolean
  editData?: string
}>()

// external components
const { t } = useI18n()
const dayStore = useDayStore()

// Variables
const monthShort = ref(format(new Date(props.day), "MMM"))
const day = ref(format(new Date(props.day), "dd"))

// Form values
const time = ref(format(new Date(), "HH:mm"))

// Functions
/**
 * Adds a wake up or go to bed to the db
 */
async function addWakeUpGoToBedToDay() {
  if (time.value == undefined) {
    await createToast(
      t("FORM_REQUIRED", { field_name: t("TIME"), data_type: props.wakeUp ? t("WAKE_UP") : t("GO_TO_BED") }),
      2000,
      "error"
    )
    return
  }
  if (props.wakeUp) {
    dayStore
      .addWakeUp(props.day, time.value)
      .then(async () => {
        await createToast(
          t("ACTION_TOAST", {
            action: t("ADD"),
            successfully_failuar: t("SUCCESSFULLY"),
            data_type: t("WAKE_UP"),
            name: time.value,
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
            data_type: t("WAKE_UP"),
            name: time.value,
          }),
          2000,
          "error"
        )
      })
  } else {
    dayStore
      .addGoToBed(props.day, time.value)
      .then(async () => {
        await createToast(
          t("ACTION_TOAST", {
            action: t("ADD"),
            successfully_failuar: t("SUCCESSFULLY"),
            data_type: t("GO_TO_BED"),
            name: time.value,
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
            data_type: t("GO_TO_BED"),
            name: time.value,
          }),
          2000,
          "error"
        )
      })
  }
}

// Init
onBeforeMount(() => {
  // When editing a wake up or go to bed, set the values
  if (props.editData) {
    time.value = props.editData
  }
})
</script>

<template>
  <v-card-title>
    <h3 class="text-xl">
      {{
        t(editData ? "EDIT_EVENT_DIALOG_TITLE" : "ADD_EVENT_DIALOG_TITLE", {
          type: props.wakeUp ? t("WAKE_UP") : t("GO_TO_BED"),
          monthShort,
          day,
        })
      }}
    </h3>
  </v-card-title>
  <v-card-text>
    <v-form class="flex flex-col gap-4">
      <TimePicker v-model="time" />
    </v-form>
  </v-card-text>
  <v-card-actions props>
    <v-btn @click="emits('close')">{{ t("CANCEL") }}</v-btn>
    <v-spacer></v-spacer>
    <v-btn @click="addWakeUpGoToBedToDay">{{ t("ADD") }}</v-btn>
  </v-card-actions>
</template>
