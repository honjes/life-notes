<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { onBeforeMount, ref } from "vue"
import { format } from "date-fns"
import { useDayStore, useMealStore } from "@/store"
import { buildMeal, createToast } from "@/utils"
import { IMealBasic } from "@/types/meal"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
}>()

// external components
const { t } = useI18n()
const mealStore = useMealStore()
const dayStore = useDayStore()

// Variables
const monthShort = ref(format(new Date(props.day), "MMM"))
const day = ref(format(new Date(props.day), "dd"))
const mealList = ref<IMealBasic[]>([])

// Form values
const time = ref(format(new Date(), "HH:mm"))
const menu2 = ref(false)
const mealLabel = ref<string>("")
const details = ref("")

// Functions
/*
 * Adds a meal to the db
 */
async function addMealToDay() {
  if (mealLabel.value == undefined || mealLabel.value === "") {
    console.log("no meal label")
    await createToast(t("MEAL_NAME_REQUIRED"), 2000, "error")
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

/**
 * Updates the symptom list
 */
async function updateMealList() {
  const meals = await mealStore.getMeals()

  mealList.value = meals
}

// Init
onBeforeMount(() => {
  updateMealList()

  // Subscribe to store changes
  mealStore.$subscribe(() => {
    updateMealList()
  })
})
</script>

<template>
  <v-card-title>
    <h3 class="text-xl">
      {{ t("ADD_EVENT_DIALOG_TITLE", { type: t("MEAL"), monthShort, day }) }}
    </h3>
  </v-card-title>
  <v-card-text>
    <v-form>
      {{ time }}
      <v-text-field v-model="time" :active="menu2" :focus="menu2" :label="t('TIME')" readonly>
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          activator="parent"
          location="center"
          transition="scale-transition"
        >
          <v-time-picker v-if="menu2" format="24hr" v-model="time" full-width></v-time-picker>
        </v-menu>
      </v-text-field>
      <v-text-field v-model="mealLabel" :label="t('MEAL')" />
      <v-text-field v-model="details" :label="t('DETAIL')" />
    </v-form>
  </v-card-text>
  <v-card-actions props>
    <v-btn @click="emits('close')">{{ t("CANCEL") }}</v-btn>
    <v-spacer></v-spacer>
    <v-btn @click="addMealToDay">{{ t("ADD") }}</v-btn>
  </v-card-actions>
</template>
