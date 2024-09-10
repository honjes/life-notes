<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { format } from "date-fns"
import { useDayStore } from "@/store"
import { createToast, NotFoundError } from "@/utils"
import { onBeforeMount, ref } from "vue"
import { TimePicker, AutoComplete } from "./Fields"
import { IMed, IMedBasic, IMedLog, IMedOverview } from "@/types/med"
import { useMedStore } from "@/store/med"
import { buildMed, buildMedForDb, buildMedLog } from "@/utils/med"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
  editData?: IMedOverview
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
const medLabel = ref<string>("")
const quantity = ref<number>(0)

// Functions
/**
 * Adds a med to the db
 */
async function addMedToDay() {
  // validation
  if (medLabel.value == undefined || medLabel.value === "") {
    await createToast(t("FORM_REQUIRED", { field_name: t("Name"), data_type: t("MED") }), 2000, "error")
    return
  }
  if (quantity.value == undefined || quantity.value === 0) {
    await createToast(t("FORM_REQUIRED", { field_name: t("QUANTITY"), data_type: t("MED") }), 2000, "error")
    return
  }

  let iMedLog: IMedLog
  if (props.editData) {
    iMedLog = { key: props.editData.logKey, time: time.value }
  } else {
    iMedLog = buildMedLog(time.value)
  }
  const iMed: IMed = buildMed(medLabel.value, quantity.value, iMedLog)
  // check if med already exists
  try {
    await medStore.getMed(medLabel.value)
  } catch (err: unknown) {
    // if it doesn't exist, add it
    if (err instanceof NotFoundError) {
      await medStore.addMed(buildMedForDb(medLabel.value, quantity.value))
    } else {
      throw err
    }
  }

  // add med to day
  dayStore
    .addMed(props.day, iMed, iMedLog)
    .then(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("ADD"),
          successfully_failuar: t("SUCCESSFULLY"),
          data_type: t("MED"),
          name: medLabel.value,
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
          name: medLabel.value,
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
  // When editing a med, set the values
  if (props.editData) {
    time.value = props.editData.time
    medLabel.value = props.editData.key
    quantity.value = props.editData.quantity
  }
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
  <v-card>
    <v-card-title>
      <h3 class="text-xl">
        {{ t(editData ? "EDIT_EVENT_DIALOG_TITLE" : "ADD_EVENT_DIALOG_TITLE", { type: t("MED"), monthShort, day }) }}
      </h3>
    </v-card-title>
    <v-card-text>
      <v-form class="flex flex-col gap-4">
        <TimePicker v-model="time" />
        <AutoComplete
          v-model="medLabel"
          :label="t('MED')"
          :items="medListItems"
          selectKey="key"
          selectValue="key"
          @update:value="(value) => (quantity = (value as unknown as IMedBasic).quantity)"
        />
        <v-text-field type="number" v-model="quantity" :label="t('QUANTITY')" hideDetails />
      </v-form>
    </v-card-text>
    <v-card-actions props>
      <v-btn @click="emits('close')">{{ t("CANCEL") }}</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="addMedToDay">{{ t(editData ? "EDIT" : "ADD") }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
