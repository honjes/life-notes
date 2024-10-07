<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { format } from "date-fns"
import { useDayStore } from "@/store"
import { buildMeal, createToast } from "@/utils"
import { onBeforeMount, ref } from "vue"
import { IMeal } from "@/types"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
  editData?: IMeal
}>()
const visible = defineModel("visible")

// external components
const { t } = useI18n()
const dayStore = useDayStore()

// Variables
const propDay = ref(props.day ? new Date(props.day) : new Date())
const monthShort = ref(format(propDay.value, "MMM"))
const dayFormatted = ref(format(propDay.value, "dd"))

// Form values
const time = ref(new Date())
const mealLabel = ref<string>("")
const details = ref("")

// Functions
/*
 * Adds a meal to the db
 */
async function addMealToDay() {
  if (mealLabel.value == undefined || mealLabel.value === "") {
    await createToast(t("FORM_REQUIRED", { field_name: t("NAME"), data_type: t("MEAL") }), 2000, "error")
    return
  }
  let IMealBasic: IMeal
  if (props.editData) {
    IMealBasic = {
      ...props.editData,
      time: format(time.value, "HH:mm"),
      detail: details.value,
    }
  } else {
    IMealBasic = buildMeal(mealLabel.value, format(time.value, "HH:mm"), details.value)
  }
  dayStore
    .addMeal(props.day, IMealBasic)
    .then(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("ADD"),
          successfully_failuar: t("SUCCESSFULLY"),
          data_type: t("MEAL"),
          name: mealLabel.value,
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
          data_type: t("MEAL"),
          name: mealLabel.value,
        }),
        2000,
        "error"
      )
    })
}

// Init
onBeforeMount(() => {
  // When editing a meal, set the values
  if (props.editData) {
    mealLabel.value = props.editData.key
    time.value = new Date(props.editData.time)
    details.value = props.editData.detail
  }
})
</script>

<template>
  <PrimeDialog v-model:visible="visible" :closable="false" :draggable="false" modal>
    <template #header>
      <h3 class="text-2xl">
        {{
          t(editData ? "EDIT_EVENT_DIALOG_TITLE" : "ADD_EVENT_DIALOG_TITLE", {
            type: t("MEAL"),
            monthShort,
            day: dayFormatted,
          })
        }}
      </h3>
    </template>
    <form class="flex flex-col gap-8">
      <FloatLabel class="mt-6">
        <DatePicker v-model="time" time-only id="time" />
        <label for="time">{{ t("TIME") }}</label>
      </FloatLabel>
      <FloatLabel>
        <InputText v-model="details" :label="t('MEAL')" />
        <label for="details">{{ t("MEAL") }}</label>
      </FloatLabel>
      <FloatLabel>
        <InputText v-model="details" :label="t('DETAIL')" />
        <label for="details">{{ t("DETAIL") }}</label>
      </FloatLabel>
    </form>
    <template #footer>
      <div class="flex w-full flex-row justify-between">
        <PrimeButton @click="emits('close')">{{ t("CANCEL") }}</PrimeButton>
        <PrimeButton @click="addMealToDay">{{ t(editData ? "EDIT" : "ADD") }}</PrimeButton>
      </div>
    </template>
  </PrimeDialog>
</template>
