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
import { AddASymptom, AddAMeal, AddWakeUpGoToBed, AddAMed, AddANote } from "@/components/Forms"
import { ISymptomOverview } from "@/types/symptom"
import { IMeal } from "@/types/meal"
import { IMedOverview } from "@/types/med"
import DetailedDataDialog from "./DetailedDataDialog.vue"

// Vue Defenitions
const props = defineProps<{
  day: DayView
}>()

// External Components
const { t } = useI18n()

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
</script>

<template>
  <aside class="flex flex-col w-full">
    <section name="header" class="flex flex-row pl-4 justify-between w-full dark:bg-gray-700 bg-gray-500 text-white">
      <div class="flex flex-row items-center">
        <h2 class="text-xl">{{ props.day.date }}</h2>
        <v-btn variant="text" icon="arrow_forward_ios" />
      </div>
      <div class="flex flex-row items-center">
        <v-bottom-sheet v-model="showBottomSheet">
          <template v-slot:activator>
            <v-btn variant="text" icon="playlist_add" @click="showBottomSheet = true" />
          </template>
          <v-card>
            <v-list>
              <v-list-item v-for="item in bottomSheetItems" :key="item.title">
                <div class="flex flex-row justify-left gap-4 ml-4" @click="openAddDataDialog(item.type, day.date)">
                  <div>
                    <v-icon>{{ item.props.prependIcon }}</v-icon>
                  </div>
                  <div>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </v-card>
        </v-bottom-sheet>
        <v-btn variant="text" icon="delete_sweep" />
      </div>
    </section>
    <section name="content" class="group flex flex-row w-full justify-between pl-4 min-h-112">
      <div class="flex flex-col gap-2 w-3/5 py-4">
        <div v-for="log in day.content" :key="log.key">
          <div
            v-if="log.type === DataTypes.symptoms"
            class="flex flex-row gap-2 bg-red-700 p-2 rounded-lg text-white"
            @click="openDetailedDialog(log)"
          >
            <div>{{ log.time }}</div>
            <div class="w-full">{{ (log as ISymptomOverview).label }}</div>
            <div>[{{ (log as ISymptomOverview).pain }}/5]</div>
            <div><v-icon>spa</v-icon></div>
          </div>
          <div
            v-else-if="log.type === DataTypes.meals"
            class="flex flex-row gap-2 bg-green-700 p-2 rounded-lg text-white"
            @click="openDetailedDialog(log)"
          >
            <div>{{ log.time }}</div>
            <div class="w-full">{{ (log as IMeal).key }}</div>
            <div><v-icon>dinner_dining</v-icon></div>
          </div>
          <div
            v-else-if="log.type === DataTypes.meds"
            class="flex flex-row gap-2 bg-blue-700 p-2 rounded-lg text-white"
            @click="openDetailedDialog(log)"
          >
            <div>{{ log.time }}</div>
            <div class="w-full">{{ (log as IMedOverview).key }}</div>
            <div>{{ (log as IMedOverview).quantity }}mg</div>
            <div><v-icon>medication</v-icon></div>
          </div>
          <div
            v-else-if="log.type === DataTypes.note"
            class="flex flex-row gap-2 bg-gray-600 p-2 rounded-lg text-white"
            @click="openDetailedDialog(log)"
          >
            <div>{{ log.time }}</div>
            <div class="w-full">{{ (log as INoteOverview).key }}</div>
            <div><v-icon>event_note</v-icon></div>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-1/5 justify-between group-h-full">
        <div
          class="h-20 rounded-bl-full bg-gray-500 flex flex-col justify-start gap-2 items-end pr-2 text-white"
          @click="editWakeUpGoToBed(DataTypes.wakeUp, day.date)"
        >
          <p class="min-h-6">{{ day.wakeUp }}</p>
          <v-icon>alarm</v-icon>
        </div>
        <div
          class="h-20 rounded-tl-full bg-gray-500 flex flex-col justify-end gap-2 items-end pr-2 text-white"
          @click="editWakeUpGoToBed(DataTypes.goToBed, day.date)"
        >
          <v-icon>bedtime</v-icon>
          <p class="min-h-6">{{ day.goToBed }}</p>
        </div>
      </div>
    </section>
  </aside>
  <v-dialog v-model="showDetailedDialog" max-width="auto">
    <template v-slot:default>
      <DetailedDataDialog
        :data="(editData as INoteOverview | IMedOverview | IMeal | ISymptomOverview)"
        :date="day.date"
        @close="closeDialogAndBottomSheet"
        @edit="editDayData"
      />
    </template>
  </v-dialog>
  <v-dialog v-model="showAddDataDialog" max-width="auto" @after-leave="closeDialogAndBottomSheet">
    <template v-slot:default>
      <v-card>
        <AddASymptom
          v-if="addDataType === DataTypes.symptoms"
          :day="addDataDay"
          :editData="shouldEdit ? (editData as ISymptomOverview): undefined"
          @close="closeDialogAndBottomSheet"
        />
        <AddAMeal
          v-else-if="addDataType === DataTypes.meals"
          :day="addDataDay"
          :editData="shouldEdit ? (editData as IMeal): undefined"
          @close="closeDialogAndBottomSheet"
        />
        <AddWakeUpGoToBed
          v-else-if="addDataType === DataTypes.wakeUp || addDataType === DataTypes.goToBed"
          :day="addDataDay"
          :wakeUp="addDataType === DataTypes.wakeUp"
          :editData="shouldEdit ? (editData as string): undefined"
          @close="closeDialogAndBottomSheet"
        />
        <AddAMed
          v-else-if="addDataType === DataTypes.meds"
          :day="addDataDay"
          :editData="shouldEdit ? (editData as IMedOverview): undefined"
          @close="closeDialogAndBottomSheet"
        />
        <AddANote
          v-else-if="addDataType === DataTypes.note"
          :day="addDataDay"
          :editData="shouldEdit ? (editData as INoteOverview): undefined"
          @close="closeDialogAndBottomSheet"
        />
      </v-card>
    </template>
  </v-dialog>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-flow: row;
}
</style>
