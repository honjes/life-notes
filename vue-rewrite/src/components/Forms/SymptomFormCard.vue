<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { onBeforeMount, ref } from "vue"
import { format } from "date-fns"
import { ISymptom, ISymptomLog, ISymptomOverview } from "@/types/symptom"
import { useRouter } from "vue-router"
import { useDayStore, useSymptomStore } from "@/store"
import { buildISymptomLog, createToast } from "@/utils"
import DatePicker from "primevue/datepicker"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
  editData?: ISymptomOverview
}>()
const visible = defineModel<boolean>("visible")

// external components
const { t } = useI18n()
const symptomStore = useSymptomStore()
const dayStore = useDayStore()
const router = useRouter()

// Variables
const propDay = ref(props.day === "" ? new Date() : new Date(props.day))
const monthShort = ref(format(propDay.value, "MMM"))
const formatedDay = ref(format(propDay.value, "dd"))
const symptomList = ref<ISymptom[]>([])

// Form values
const time = ref(format(new Date(), "HH:mm"))
const selectedSymptom = ref<ISymptom | string>()
const pain = ref(0)
const details = ref("")

// Functions
// closes Dialog and routes to symptom list
function goToAddASymptom() {
  emits("close")
  router.push({ name: "Symptoms" })
}

/*
 * Adds a symptom to the db
 */
async function addSymptomToDay() {
  if (selectedSymptom.value == undefined) {
    await createToast(t("FORM_REQUIRED", { field_name: t("NAME"), data_type: t("SYMPTOM") }), 2000, "error")
    return
  }
  const symptom = selectedSymptom.value as ISymptom
  let symptomLog: ISymptomLog
  if (props.editData) {
    symptomLog = {
      key: props.editData.logKey,
      time: time.value,
      pain: pain.value,
      detail: details.value,
    }
  } else {
    symptomLog = buildISymptomLog(time.value, pain.value, details.value)
  }
  dayStore
    .addSymptom(props.day, symptom, symptomLog)
    .then(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("ADD"),
          successfully_failuar: t("SUCCESSFULLY"),
          data_type: t("SYMPTOM"),
          name: symptom.label,
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
          data_type: t("SYMPTOM"),
          name: symptom.label,
        }),
        2000,
        "error"
      )
    })
}

/**
 * Updates the symptom list
 */
async function updateSymptomList() {
  const symptoms = await symptomStore.getSymptoms()

  symptomList.value = symptoms
}

// Function to close the dialog
function closeDialog() {
  emits("close")
  visible.value = false
}

// Init
onBeforeMount(() => {
  updateSymptomList()

  // Subscribe to store changes
  symptomStore.$subscribe(() => {
    updateSymptomList()
  })
  // When editing a symptom, set the values
  if (props.editData) {
    selectedSymptom.value = props.editData.label
    time.value = props.editData.time
    pain.value = props.editData.pain
    details.value = props.editData.detail
  }
})
</script>

<template>
  <PrimeDialog v-model:visible="visible" :closable="false" :draggable="false" modal>
    <template #header>
      <h3 class="text-xl">
        {{
          t(editData ? "EDIT_EVENT_DIALOG_TITLE" : "ADD_EVENT_DIALOG_TITLE", {
            type: t("SYMPTOM"),
            monthShort,
            day: formatedDay,
          })
        }}
      </h3>
    </template>
    <form class="flex flex-col gap-8">
      <FloatLabel class="mt-6 w-full">
        <DatePicker v-model="time" id="datePicker" time-only fluid />
        <label for="datePicker">{{ t("TIME") }}</label>
      </FloatLabel>
      <div name="symptom-select" class="flex flex-row gap-2">
        <FloatLabel class="w-full">
          <PrimeSelect
            class="w-full"
            v-model="selectedSymptom"
            :options="symptomList"
            optionLabel="label"
            item-title="label"
            id="symptomSelect"
            :emptySelectionMessage="t('EMPTY_SYMPTOMS_1')"
          />
          <label for="symptomSelect">{{ t("SYMPTOM") }}</label>
        </FloatLabel>
        <PrimeButton text @click="goToAddASymptom">
          <i class="material-icons">add</i>
        </PrimeButton>
      </div>
      <div class="flex flex-col gap-2">
        <label>{{ t("PAIN") }}</label>
        <div class="flex flex-row items-center gap-4">
          <Slider class="ml-4 w-full" v-model="pain" :min="0" :max="5" :step="1" />
          {{ pain }}
        </div>
      </div>
      <FloatLabel class="w-full">
        <InputText class="w-full" v-model="details" hide-details id="details" />
        <label for="details">{{ t("DETAIL") }}</label>
      </FloatLabel>
    </form>
    <template #footer>
      <div class="flex w-full flex-row justify-between">
        <PrimeButton @click="closeDialog">{{ t("CANCEL") }}</PrimeButton>
        <PrimeButton @click="addSymptomToDay">{{ t(editData ? "EDIT" : "ADD") }}</PrimeButton>
      </div>
    </template>
  </PrimeDialog>
</template>
