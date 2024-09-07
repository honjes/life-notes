<script lang="ts" setup>
/*
 * DayView component displays a day and the symptoms of that day also has possability to add data to a day
 * It also has a bottom sheet to add data to a day
 * @TODO: add posability to add a note
 * @TODO: add posability to delete data
 */
import { DayView } from "@/types/day"
import { LogTypes } from "@/types/log"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { AddASymptom, AddAMeal, AddWakeUpGoToBed, AddAMed } from "@/components/Forms"
import { ISymptomOverview } from "@/types/symptom"
import { IMeal } from "@/types/meal"
import { IMed } from "@/types/med"

// Vue Defenitions
const props = defineProps<{
  day: DayView
}>()

// External Components
const { t } = useI18n()

// Variables
// Bottom sheet variables
const bottomSheetItems = ref<{ title: string; type: LogTypes; props: { prependIcon: string } }[]>([
  { title: t("ADD_SYMPTOM_BOTTOMSHEET"), type: LogTypes.symptoms, props: { prependIcon: "spa" } },
  { title: t("ADD_MEAL_BOTTOMSHEET"), type: LogTypes.meals, props: { prependIcon: "dinner_dining" } },
  { title: t("ADD_DRUG_BOTTOMSHEET"), type: LogTypes.meds, props: { prependIcon: "medication" } },
  { title: t("ADD_NOTE_BOTTOMSHEET"), type: LogTypes.note, props: { prependIcon: "event_note" } },
])
const showAddDataDialog = ref(false)
const addDataType = ref<LogTypes>(LogTypes.symptoms)
const addDataDay = ref<string>("")
const showBottomSheet = ref(false)
// Data variables

// Functions
// Function to close the dialog and the bottom sheet
function closeDialogAndBottomSheet() {
  showAddDataDialog.value = false
  showBottomSheet.value = false
}

/**
 * Opens a Dialog
 * @param {LogTypes} type - type of Data to add
 * @param {string} day - day to add the data
 */
function openAddDataDialog(type: LogTypes, day: string) {
  addDataType.value = type
  addDataDay.value = day
  showAddDataDialog.value = true
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
          <div v-if="log.type === LogTypes.symptoms" class="flex flex-row gap-2 bg-red-700 p-2 rounded-lg text-white">
            <div>{{ log.time }}</div>
            <div class="w-full">{{ (log as ISymptomOverview).label }}</div>
            <div>[{{ (log as ISymptomOverview).pain }}/5]</div>
            <div><v-icon>spa</v-icon></div>
          </div>
          <div v-if="log.type === LogTypes.meals" class="flex flex-row gap-2 bg-green-700 p-2 rounded-lg text-white">
            <div>{{ log.time }}</div>
            <div class="w-full">{{ (log as IMeal).key }}</div>
            <div><v-icon>dinner_dining</v-icon></div>
          </div>
          <div v-if="log.type === LogTypes.meds" class="flex flex-row gap-2 bg-blue-700 p-2 rounded-lg text-white">
            <div>{{ log.time }}</div>
            <div class="w-full">{{ (log as IMed).key }}</div>
            <div><v-icon>medication</v-icon></div>
          </div>
        </div>
      </div>
      <div class="flex flex-col w-1/5 justify-between group-h-full">
        <div
          class="h-20 rounded-bl-full bg-gray-500 flex flex-col justify-start gap-2 items-end pr-2 text-white"
          @click="openAddDataDialog(LogTypes.wakeUp, day.date)"
        >
          <p class="min-h-6">{{ day.wakeUp }}</p>
          <v-icon>alarm</v-icon>
        </div>
        <div
          class="h-20 rounded-tl-full bg-gray-500 flex flex-col justify-end gap-2 items-end pr-2 text-white"
          @click="openAddDataDialog(LogTypes.goToBed, day.date)"
        >
          <v-icon>bedtime</v-icon>
          <p class="min-h-6">{{ day.goToBed }}</p>
        </div>
      </div>
    </section>
  </aside>
  <v-dialog v-model="showAddDataDialog" max-width="auto">
    <template v-slot:default>
      <v-card>
        <AddASymptom :day="addDataDay" v-if="addDataType === LogTypes.symptoms" @close="closeDialogAndBottomSheet" />
        <AddAMeal :day="addDataDay" v-else-if="addDataType === LogTypes.meals" @close="closeDialogAndBottomSheet" />
        <AddWakeUpGoToBed
          :day="addDataDay"
          :wakeUp="addDataType === LogTypes.wakeUp"
          v-else-if="addDataType === LogTypes.wakeUp || addDataType === LogTypes.goToBed"
          @close="closeDialogAndBottomSheet"
        />
        <AddAMed :day="addDataDay" v-else-if="addDataType === LogTypes.meds" @close="closeDialogAndBottomSheet" />
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
