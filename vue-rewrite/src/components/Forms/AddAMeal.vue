<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { format } from "date-fns"
import { useDayStore } from "@/store"
import { buildMeal, createToast } from "@/utils"
import { ref } from "vue"
import { TimePicker } from "./Fields"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
}>()

// external components
const { t } = useI18n()
const dayStore = useDayStore()

// Variables
const monthShort = ref(format(new Date(props.day), "MMM"))
const day = ref(format(new Date(props.day), "dd"))

// Form values
const time = ref(format(new Date(), "HH:mm"))
const mealLabel = ref<string>("")
const details = ref("")

// Functions
/*
 * Adds a meal to the db
 */
async function addMealToDay() {
  if (mealLabel.value == undefined || mealLabel.value === "") {
    console.log("no meal label")
    await createToast(t("FORM_REQUIRED", { field_name: t("NAME"), data_type: t("MEAL") }), 2000, "error")
    return
  }
  dayStore
    .addMeal(props.day, buildMeal(mealLabel.value, time.value, details.value))
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
</script>

<template>
  <v-card-title>
    <h3 class="text-xl">
      {{ t("ADD_EVENT_DIALOG_TITLE", { type: t("MEAL"), monthShort, day }) }}
    </h3>
  </v-card-title>
  <v-card-text>
    <v-form class="flex flex-col gap-4">
      <TimePicker v-model="time" />
      <v-text-field v-model="mealLabel" :label="t('MEAL')" hide-details />
      <v-text-field v-model="details" :label="t('DETAIL')" hide-details />
    </v-form>
  </v-card-text>
  <v-card-actions props>
    <v-btn @click="emits('close')">{{ t("CANCEL") }}</v-btn>
    <v-spacer></v-spacer>
    <v-btn @click="addMealToDay">{{ t("ADD") }}</v-btn>
  </v-card-actions>
</template>
