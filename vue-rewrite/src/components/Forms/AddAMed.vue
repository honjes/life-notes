<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { format } from "date-fns"
import { useDayStore } from "@/store"
import { createToast, NotFoundError } from "@/utils"
import { onBeforeMount, ref } from "vue"
import { TimePicker, AutoComplete } from "./Fields"
import { IMedBasic } from "@/types/med"
import { useMedStore } from "@/store/med"
import { buildMed } from "@/utils/med"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
}>()

// external components
const { t } = useI18n()
const dayStore = useDayStore()
const medStore = useMedStore()

// Variables
const monthShort = ref(format(new Date(props.day), "MMM"))
const day = ref(format(new Date(props.day), "dd"))
const medListItems = ref<IMedBasic[]>([])

// Form values
const time = ref(format(new Date(), "HH:mm"))
const med = ref<string>("")
const quantity = ref<number>(0)

// Functions
/**
 * Adds a med to the db
 */
async function addMedToDay() {
  // validation
  if (med.value == undefined || med.value === "") {
    await createToast(t("FORM_REQUIRED", { field_name: t("Name"), data_type: t("MED") }), 2000, "error")
    return
  }
  if (quantity.value == undefined || quantity.value === 0) {
    await createToast(t("FORM_REQUIRED", { field_name: t("QUANTITY"), data_type: t("MED") }), 2000, "error")
    return
  }

  // check if med already exists
  let IMedBasic: IMedBasic
  try {
    IMedBasic = await medStore.getMed(med.value)
  } catch (err: unknown) {
    // if it doesn't exist, add it
    if (err instanceof NotFoundError) {
      IMedBasic = buildMed(med.value, quantity.value, time.value)
      await medStore.addMed(IMedBasic)
    } else {
      throw err
    }
  }
  // add med to day
  dayStore
    .addMed(props.day, { ...IMedBasic, time: time.value })
    .then(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("ADD"),
          successfully_failuar: t("SUCCESSFULLY"),
          data_type: t("MED"),
          name: med.value,
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
          data_type: t("MED"),
          name: med.value,
        }),
        2000,
        "error"
      )
    })
}

/**
 * Updates the med list
 */
async function updateMedList() {
  const meds = await medStore.getMeds()

  medListItems.value = meds
}

// Init
onBeforeMount(() => {
  updateMedList()

  // Subscribe to store changes
  medStore.$subscribe(() => {
    updateMedList()
  })
})
</script>

<template>
  <v-card-title>
    <h3 class="text-xl">
      {{ t("ADD_EVENT_DIALOG_TITLE", { monthShort, day }) }}
    </h3>
  </v-card-title>
  <v-card-text>
    <v-form>
      {{ time }}
      <TimePicker v-model="time" />
      <AutoComplete
        v-model="med"
        :label="t('MED')"
        :items="medListItems"
        selectKey="key"
        selectValue="key"
        @update:value="(value) => (quantity = (value as unknown as IMedBasic).quantity)"
      />
      <v-text-field type="number" v-model="quantity" :label="t('QUANTITY')" />
    </v-form>
  </v-card-text>
  <v-card-actions props>
    <v-btn @click="emits('close')">{{ t("CANCEL") }}</v-btn>
    <v-spacer></v-spacer>
    <v-btn @click="addMedToDay">{{ t("ADD") }}</v-btn>
  </v-card-actions>
</template>
