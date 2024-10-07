<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { format } from "date-fns"
import { useDayStore } from "@/store"
import { createToast } from "@/utils"
import { onBeforeMount, ref } from "vue"
import { IMed, IMedBasic, IMedLog, IMedOverview } from "@/types/med"
import { useMedStore } from "@/store/med"
import { buildMed, buildMedForDb, buildMedLog } from "@/utils/med"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
  editData?: IMedOverview
}>()
const visible = defineModel<boolean>("visible")

// external components
const { t } = useI18n()
const dayStore = useDayStore()
const medStore = useMedStore()

// Variables
const propDay = ref(props.day ? new Date(props.day) : new Date())
const monthShort = ref(format(propDay.value, "MMM"))
const formattedDay = ref(format(propDay.value, "dd"))
const medListItems = ref<IMedBasic[]>([])
const medSuggestions = ref<IMedBasic[]>([])

// Form values
const time = ref(new Date())
const selectedMed = ref<IMed | string>("")
const quantity = ref<number>(0)

// Functions
/**
 * Searches for meds in the med list and updates the suggestions
 * @param {string} value - value to search for
 */
function searchMeds(event: { originalEvent: Event; query: string }): void {
  medSuggestions.value = medListItems.value.filter(med => med.key.toLowerCase().includes(event.query.toLowerCase()))
}

/**
 * Adds a med to the db
 */
async function addMedToDay() {
  // validation
  if (selectedMed.value == undefined || selectedMed.value === "") {
    await createToast(t("FORM_REQUIRED", { field_name: t("Name"), data_type: t("MED") }), 2000, "error")
    return
  }
  if (quantity.value == undefined || quantity.value === 0) {
    await createToast(t("FORM_REQUIRED", { field_name: t("QUANTITY"), data_type: t("MED") }), 2000, "error")
    return
  }

  let iMedLog: IMedLog
  if (props.editData) {
    iMedLog = { key: props.editData.logKey, time: format(time.value, "HH:mm") }
  } else {
    iMedLog = buildMedLog(format(time.value, "HH:mm"))
  }
  let iMed: IMed
  // check if med already exists
  if (typeof selectedMed.value === "string") {
    await medStore.addMed(buildMedForDb(selectedMed.value, quantity.value))
    iMed = buildMed(selectedMed.value, quantity.value, iMedLog)
  } else {
    iMed = selectedMed.value
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
          name: iMed.key,
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
          name: iMed.key,
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
    time.value = new Date(props.editData.time)
    selectedMed.value = props.editData.key
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
  <PrimeDialog v-model:visible="visible" :closable="false" :draggable="false" modal>
    <template #header>
      <h3 class="text-2xl">
        {{
          t(editData ? "EDIT_EVENT_DIALOG_TITLE" : "ADD_EVENT_DIALOG_TITLE", {
            type: t("MED"),
            monthShort,
            day: formattedDay,
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
        <AutoComplete
          id="medLabel"
          v-model="selectedMed"
          :suggestions="medSuggestions"
          option-label="key"
          :label="t('MED')"
          :empty-search-message="t('NO_MEDS_FOUND')"
          @complete="searchMeds"
          @item-select="value => (quantity = value.value.quantity)"
        />
        <label for="medLabel">{{ t("MED") }}</label>
      </FloatLabel>
      <FloatLabel>
        <InputNumber v-model="quantity" />
        <label for="details">{{ t("QUANTITY") }}</label>
      </FloatLabel>
    </form>
    <template #footer>
      <div class="flex w-full flex-row justify-between">
        <PrimeButton @click="emits('close')">{{ t("CANCEL") }}</PrimeButton>
        <PrimeButton @click="addMedToDay">{{ t(editData ? "EDIT" : "ADD") }}</PrimeButton>
      </div>
    </template>
  </PrimeDialog>
</template>
