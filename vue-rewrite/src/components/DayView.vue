<script lang="ts" setup>
/*
 * DayView component displays a day and the symptoms of that day also has possability to add data to a day
 * It also has a bottom sheet to add data to a day
 * @TODO: add posability to delete data
 * @TODO: add posability to edit data/View data
 */
import { DayView } from "@/types/day"
import { DataTypes, INoteOverview } from "@/types/note"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { SymptomFormCard, MealFormCard, WakeUpGoToBedFormCard, MedFormCard, NoteFormCard } from "@/components/Forms"
import { ISymptomOverview } from "@/types/symptom"
import { IMeal } from "@/types/meal"
import { IMedOverview } from "@/types/med"
import DetailedDataDialog from "./DetailedDataDialog.vue"
import { getDay, getMonth, format } from "date-fns"
import { useDayStore } from "@/store"
import { createToast } from "@/utils"

// Vue Defenitions
const props = defineProps<{
  day: DayView
}>()

// External Components
const { t } = useI18n()
const dayStore = useDayStore()

// Variables
// Bottom sheet variables
const bottomSheetItems = ref<{ title: string; type: DataTypes; props: { prependIcon: string } }[]>([
  { title: t("ADD_SYMPTOM_BOTTOMSHEET"), type: DataTypes.symptoms, props: { prependIcon: "spa" } },
  { title: t("ADD_MEAL_BOTTOMSHEET"), type: DataTypes.meals, props: { prependIcon: "dinner_dining" } },
  { title: t("ADD_DRUG_BOTTOMSHEET"), type: DataTypes.meds, props: { prependIcon: "medication" } },
  { title: t("ADD_NOTE_BOTTOMSHEET"), type: DataTypes.note, props: { prependIcon: "event_note" } },
])
const showAddDataDialog = ref(false)
const addDataType = ref<DataTypes>(DataTypes.symptoms)
const addDataDay = ref<string>("")
const showBottomSheet = ref(false)
// Edit data variables
const editData = ref<INoteOverview | IMedOverview | IMeal | ISymptomOverview | string>()
const shouldEdit = ref(false)
const showDetailedDialog = ref(false)
// Delete View
const deleteData = ref<INoteOverview | IMedOverview | IMeal | ISymptomOverview>()
const showDeleteDialog = ref(false)
const deleteDataType = ref<DataTypes>(DataTypes.symptoms)
const showDeleteIcon = ref(false)

// Functions
/**
 * Opnens a dialog to see a detailed view of a item
 * @param {INoteOverview | IMedOverview | IMeal | ISymptomOverview} data - data to show
 */
function openDetailedDialog(data: INoteOverview | IMedOverview | IMeal | ISymptomOverview) {
  editData.value = data
  showDetailedDialog.value = true
}

/**
 * Edits a day data
 * @param {string} date - date of the data
 * @param {INoteOverview | IMedOverview | IMeal | ISymptomOverview} data - data to edit
 */
function editDayData(data: INoteOverview | IMedOverview | IMeal | ISymptomOverview) {
  shouldEdit.value = true
  showDetailedDialog.value = false
  editData.value = data
  showAddDataDialog.value = true
  addDataDay.value = props.day.date
  addDataType.value = data.type
}

/**
 * Edit wake up or go to bed
 * @param {DataType} type - wakeup or go to bed
 * @param {string} data - data to edit
 */
function editWakeUpGoToBed(type: DataTypes, data: string) {
  showDetailedDialog.value = false
  editData.value = data
  showAddDataDialog.value = true
  addDataDay.value = props.day.date
  addDataType.value = type
  if (type === DataTypes.wakeUp && props.day.wakeUp !== "") {
    shouldEdit.value = true
  } else if (type === DataTypes.goToBed && props.day.goToBed !== "") {
    shouldEdit.value = true
  }
}

// Function to close the dialog and the bottom sheet
function closeDialogAndBottomSheet() {
  editData.value = undefined
  shouldEdit.value = false
  showDetailedDialog.value = false
  showAddDataDialog.value = false
  showBottomSheet.value = false
}

/**
 * Opens a Dialog
 * @param {DataTypes} type - type of Data to add
 * @param {string} day - day to add the data
 */
function openAddDataDialog(type: DataTypes, day: string) {
  addDataType.value = type
  addDataDay.value = day
  showAddDataDialog.value = true
}

/**
 * Opens a dialog to delete a data
 * @param {INoteOverview | IMedOverview | IMeal | ISymptomOverview} data - data to delete
 */
function showDeleteDilog(data: INoteOverview | IMedOverview | IMeal | ISymptomOverview) {
  deleteData.value = data
  showDeleteDialog.value = true
  deleteDataType.value = data.type
}

/**
 * Deletes a data item from a day
 */
async function deleteEvent() {
  showDeleteDialog.value = false
  createToast(t("TIMELINE_DELETE_EVENT_SNACKBAR", { type: t(deleteDataType.value) }), 2000, "success")
  dayStore.deleteData(
    props.day.date,
    deleteDataType.value,
    (deleteData.value as ISymptomOverview).key,
    deleteDataType.value === DataTypes.meals ? undefined : (deleteData.value as ISymptomOverview).logKey
  )
}
</script>

<template>
  <aside class="flex w-full flex-col border-b-2 border-b-black">
    <div name="header" class="bg-surface-400 dark:bg-surface-700 flex w-full flex-row justify-between p-4">
      <div class="flex flex-row items-center">
        <h3 class="text-2xl">{{ format(new Date(props.day.date), "iii MMM, dd yyyy") }}</h3>
        <PrimeButton link>
          <i class="material-icons">arrow_forward_ios</i>
        </PrimeButton>
      </div>
      <div class="flex flex-row items-center">
        <PrimeButton @click="showBottomSheet = true" label="Primary" link>
          <i class="material-icons">playlist_add</i>
        </PrimeButton>
        <PrimeButton @click="showDeleteIcon = !showDeleteIcon" link>
          <i class="material-icons">delete_sweep</i>
        </PrimeButton>
      </div>
    </div>
    <section name="content" class="min-h-112 group flex w-full flex-row justify-between pl-4">
      <div name="logs" class="flex w-3/5 flex-col gap-2 py-4">
        <div v-for="log in day.content" :key="log.key">
          <div
            name="symptom"
            v-if="log.type === DataTypes.symptoms"
            class="flex flex-row gap-2 rounded-lg bg-red-700 p-2 text-white"
          >
            <div class="flex w-full flex-row gap-2" @click="openDetailedDialog(log)">
              <div>{{ log.time }}</div>
              <div class="w-full">{{ (log as ISymptomOverview).label }}</div>
              <div>[{{ (log as ISymptomOverview).pain }}/5]</div>
              <div><i class="material-icons">spa</i></div>
            </div>
            <div v-if="showDeleteIcon" @click="showDeleteDilog(log)"><i class="material-icons">delete</i></div>
          </div>
          <div
            name="meal"
            v-else-if="log.type === DataTypes.meals"
            class="flex flex-row gap-2 rounded-lg bg-green-700 p-2 text-white"
          >
            <div class="flex w-full flex-row gap-2" @click="openDetailedDialog(log)">
              <div>{{ log.time }}</div>
              <div class="w-full">{{ (log as IMeal).key }}</div>
              <div><i class="material-icons">dinner_dining</i></div>
            </div>
            <div v-if="showDeleteIcon" @click="showDeleteDilog(log)"><i class="material-icons">delete</i></div>
          </div>
          <div
            name="med"
            v-else-if="log.type === DataTypes.meds"
            class="flex flex-row gap-2 rounded-lg bg-blue-700 p-2 text-white"
          >
            <div class="flex w-full flex-row gap-2" @click="openDetailedDialog(log)">
              <div>{{ log.time }}</div>
              <div class="w-full">{{ (log as IMedOverview).key }}</div>
              <div>{{ (log as IMedOverview).quantity }}mg</div>
              <div><i class="material-icons">medication</i></div>
            </div>
            <div v-if="showDeleteIcon" @click="showDeleteDilog(log)"><i class="material-icons">delete</i></div>
          </div>
          <div
            name="note"
            v-else-if="log.type === DataTypes.note"
            class="flex w-full flex-row gap-2 rounded-lg bg-gray-600 p-2 text-white"
          >
            <div class="flex w-full flex-row gap-2" @click="openDetailedDialog(log)">
              <div>{{ log.time }}</div>
              <div class="w-full">{{ (log as INoteOverview).key }}</div>
              <div><i class="material-icons">event_note</i></div>
            </div>
            <div v-if="showDeleteIcon" @click="showDeleteDilog(log)"><i class="material-icons">delete</i></div>
          </div>
        </div>
      </div>
      <div name="wakeup-sleep-container" class="group-h-full flex w-1/5 flex-col justify-between">
        <div
          class="bg-surface-300 dark:bg-surface-600 flex h-20 flex-col items-end justify-start gap-2 rounded-bl-full pr-2"
          @click="editWakeUpGoToBed(DataTypes.wakeUp, day.wakeUp)"
        >
          <p class="min-h-6">{{ day.wakeUp }}</p>
          <PrimeButton class="p-0" link><i class="material-icons">alarm</i></PrimeButton>
        </div>
        <div
          class="bg-surface-300 dark:bg-surface-600 flex h-20 flex-col items-end justify-end gap-2 rounded-tl-full pr-2"
          @click="editWakeUpGoToBed(DataTypes.goToBed, day.goToBed)"
        >
          <PrimeButton class="p-0" link><i class="material-icons">bedtime</i></PrimeButton>
          <p class="min-h-6">{{ day.goToBed }}</p>
        </div>
      </div>
    </section>
  </aside>
  <div name="drawer">
    <Drawer
      position="bottom"
      class="!h-auto"
      v-model:visible="showBottomSheet"
      header="Hinzufügen"
      :dismissable="false"
    >
      <template #container>
        <div class="flex flex-col gap-2 py-4">
          <div v-for="item in bottomSheetItems" :key="item.title">
            <div class="justify-left ml-4 flex flex-row gap-4" @click="openAddDataDialog(item.type, day.date)">
              <i class="material-icons">{{ item.props.prependIcon }}</i>
              <p class="text-base">
                {{ item.title }}
              </p>
            </div>
          </div>
        </div>
      </template>
    </Drawer>
  </div>
  <div name="dialog">
    <DetailedDataDialog
      v-if="showDetailedDialog"
      v-model:visible="showDetailedDialog"
      :data="{ ...(editData as INoteOverview | IMedOverview | IMeal | ISymptomOverview) }"
      :date="day.date"
      @close="closeDialogAndBottomSheet"
      @edit="editDayData"
    />
    <div v-if="showAddDataDialog">
      <SymptomFormCard
        v-if="addDataType === DataTypes.symptoms"
        v-model:visible="showAddDataDialog"
        :day="addDataDay"
        :editData="shouldEdit ? (editData as ISymptomOverview) : undefined"
        @close="closeDialogAndBottomSheet"
      />
      <MealFormCard
        v-else-if="addDataType === DataTypes.meals"
        v-model:visible="showAddDataDialog"
        :day="addDataDay"
        :editData="shouldEdit ? (editData as IMeal) : undefined"
        @close="closeDialogAndBottomSheet"
      />
      <MedFormCard
        v-else-if="addDataType === DataTypes.meds"
        v-model:visible="showAddDataDialog"
        :day="addDataDay"
        :editData="shouldEdit ? (editData as IMedOverview) : undefined"
        @close="closeDialogAndBottomSheet"
      />
      <NoteFormCard
        v-else-if="addDataType === DataTypes.note"
        v-model:visible="showAddDataDialog"
        :day="addDataDay"
        :editData="shouldEdit ? (editData as INoteOverview) : undefined"
        @close="closeDialogAndBottomSheet"
      />
      <WakeUpGoToBedFormCard
        v-else-if="addDataType === DataTypes.wakeUp || addDataType === DataTypes.goToBed"
        v-model:visible="showAddDataDialog"
        :day="addDataDay"
        :wakeUp="addDataType === DataTypes.wakeUp"
        :editData="shouldEdit ? (editData as string) : undefined"
        @close="closeDialogAndBottomSheet"
      />
    </div>
    <PrimeDialog v-model:visible="showDeleteDialog" :draggable="false" :closable="false" modal>
      <template #header>
        <h3 class="text-2xl">
          {{ t("DELETE_EVENT_DIALOG_TITLE", { type: t(deleteDataType) }) }}
        </h3>
      </template>
      <p>
        {{
          t("DELETE_EVENT_DIALOG_CONTENT", {
            type: t(deleteDataType),
            time: deleteData?.time,
            month: t("MONTH-" + (getMonth(day.date) + 1)),
            day: getDay(day.date),
          })
        }}
      </p>
      <template #footer>
        <div class="flex w-full flex-row justify-between">
          <PrimeButton @click="showDeleteDialog = false">{{ t("CANCEL") }}</PrimeButton>
          <PrimeButton @click="deleteEvent">{{ t("DELETE") }}</PrimeButton>
        </div>
      </template>
    </PrimeDialog>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-flow: row;
}
</style>
