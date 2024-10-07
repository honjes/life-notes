<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { format, parse } from "date-fns"
import { useDayStore } from "@/store"
import { createToast } from "@/utils"
import { onBeforeMount, ref } from "vue"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
  wakeUp?: boolean
  editData?: string
}>()
const visible = defineModel<boolean>("visible")

// external components
const { t } = useI18n()
const dayStore = useDayStore()

// Variables
const propDay = ref(props.day ? new Date(props.day) : new Date())
const monthShort = ref(format(propDay.value, "MMM"))
const formattedDay = ref(format(propDay.value, "dd"))

// Form values
const time = ref<Date>(new Date())

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
      .addWakeUp(props.day, format(time.value, "HH:mm"))
      .then(async () => {
        await createToast(
          t("ACTION_TOAST", {
            action: t("ADD"),
            successfully_failuar: t("SUCCESSFULLY"),
            data_type: t("WAKE_UP"),
            name: format(time.value, "HH:mm"),
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
            name: format(time.value, "HH:mm"),
          }),
          2000,
          "error"
        )
      })
  } else {
    dayStore
      .addGoToBed(props.day, format(time.value, "HH:mm"))
      .then(async () => {
        await createToast(
          t("ACTION_TOAST", {
            action: t("ADD"),
            successfully_failuar: t("SUCCESSFULLY"),
            data_type: t("GO_TO_BED"),
            name: format(time.value, "HH:mm"),
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
            name: format(time.value, "HH:mm"),
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
    console.log(props.editData)
    time.value = parse(props.editData, "HH:mm", new Date())
  }
})
</script>

<template>
  <PrimeDialog v-model:visible="visible" :closable="false" :draggable="false" modal>
    <template #header>
      <h3 class="text-xl">
        {{
          t(editData ? "EDIT_EVENT_DIALOG_TITLE" : "ADD_EVENT_DIALOG_TITLE", {
            type: props.wakeUp ? t("WAKE_UP") : t("GO_TO_BED"),
            monthShort,
            day: formattedDay,
          })
        }}
      </h3>
    </template>
    <form class="flex flex-col gap-4">
      <DatePicker v-model="time" time-only />
    </form>
    <template #footer>
      <div class="flex w-full flex-row justify-between">
        <PrimeButton @click="emits('close')">{{ t("CANCEL") }}</PrimeButton>
        <PrimeButton @click="addWakeUpGoToBedToDay">{{ t(editData ? "EDIT" : "ADD") }}</PrimeButton>
      </div>
    </template>
  </PrimeDialog>
</template>
