<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { onBeforeMount, ref } from "vue"
import { format } from "date-fns"
import { ISymptom, ISymptomLog, ISymptomOverview } from "@/types/symptom"
import { useRouter } from "vue-router"
import { useDayStore, useSymptomStore } from "@/store"
import { buildISymptomLog, createToast } from "@/utils"
import { TimePicker } from "./Fields"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
  editData?: ISymptomOverview
}>()

// external components
const { t } = useI18n()
const symptomStore = useSymptomStore()
const dayStore = useDayStore()
const router = useRouter()

// Variables
const monthShort = ref(format(new Date(props.day), "MMM"))
const day = ref(format(new Date(props.day), "dd"))
const symptomList = ref<ISymptom[]>([])

// Form values
const time = ref(format(new Date(), "HH:mm"))
const symptomLabel = ref<string>("")
const pain = ref(0)
const details = ref("")

// Functions
// closes Dialog and routes to symptom list
function goToAddASymptom() {
  emits("close")
  router.push({ name: "Symptom List" })
}

/*
 * Adds a symptom to the db
 */
async function addSymptomToDay() {
  if (symptomLabel.value == undefined) {
    await createToast(t("FORM_REQUIRED", { field_name: t("NAME"), data_type: t("SYMPTOM") }), 2000, "error")
    return
  }
  const symptom = await symptomStore.getSymptomByLabel(symptomLabel.value)
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
          name: symptomLabel.value,
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
          name: symptomLabel.value,
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

// Init
onBeforeMount(() => {
  updateSymptomList()

  // Subscribe to store changes
  symptomStore.$subscribe(() => {
    updateSymptomList()
  })
  // When editing a symptom, set the values
  if (props.editData) {
    symptomLabel.value = props.editData.label
    time.value = props.editData.time
    pain.value = props.editData.pain
    details.value = props.editData.detail
  }
})
</script>

<template>
  <v-card-title>
    <h3 class="text-xl">
      {{ t(editData ? "EDIT_EVENT_DIALOG_TITLE" : "ADD_EVENT_DIALOG_TITLE", { type: t("SYMPTOM"), monthShort, day }) }}
    </h3>
  </v-card-title>
  <v-card-text>
    <v-form class="flex flex-col gap-4">
      <TimePicker v-model="time" />
      <div class="flex flex-row gap-4">
        <v-select
          v-model="symptomLabel"
          :items="symptomList"
          item-value="label"
          item-title="label"
          :label="t('SYMPTOM')"
        >
          <template v-slot:no-data>
            <v-list-item>
              {{ t("EMPTY_SYMPTOMS_1") }}
            </v-list-item>
          </template>
        </v-select>
        <v-btn density="compact" size="large" icon="add" class="mt-3 h-fit" @click="goToAddASymptom" />
      </div>
      <div class="flex flex-row gap-4">
        <v-slider :label="t('PAIN')" v-model="pain" min="0" max="5" step="1" thumb-label hide-details />
        {{ pain }}
      </div>
      <v-text-field v-model="details" :label="t('DETAIL')" hide-details />
    </v-form>
  </v-card-text>
  <v-card-actions props>
    <v-btn @click="emits('close')">{{ t("CANCEL") }}</v-btn>
    <v-spacer></v-spacer>
    <v-btn @click="addSymptomToDay">{{ t(editData ? "ADD" : "EDIT") }}</v-btn>
  </v-card-actions>
</template>
