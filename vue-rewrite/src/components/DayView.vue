<script lang="ts" setup>
/*
 * DayView component displays a day and the symptoms of that day also has possability to add data to a day
 * It also has a bottom sheet to add data to a day
 * @TODO: add posability to add WakeUp and GoToBed times
 * @TODO: add posability to add a note
 * @TODO: add posability to add a med
 * @TODO: add posability to add a meal
 * @TODO: add posability to delete data
 * @TODO: make style match the original app
 */
import { DayView } from "@/types/day"
import { LogTypes } from "@/types/log"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import AddASymptom from "@/components/Forms/AddASymptom.vue"
import { ISymptomOverview } from "@/types/symptom"

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
</script>

<template>
  <div class="flex flex-col gap-2 w-full min-h-120">
    <div class="flex flex-row justify-between w-full">
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
                <div
                  class="flex flex-row justify-left gap-4 ml-4"
                  @click="
                    () => {
                      showAddDataDialog = true
                      addDataType = item.type
                      addDataDay = day.date
                    }
                  "
                >
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
    </div>
    <div class="flex flex-col gap-2 w-3/5">
      <div
        class="w-full flex flex-row gap-2 bg-red-700 p-2 rounded-lg"
        v-for="log in (day.content.filter(l => l.type === LogTypes.symptoms) as ISymptomOverview[])"
        :key="log.key"
      >
        <div>{{ log.time }}</div>
        <div class="w-full">{{ log.label }}</div>
        <div>[{{ log.pain }}/5]</div>
      </div>
    </div>
  </div>
  <v-dialog v-model="showAddDataDialog" max-width="auto">
    <template v-slot:default>
      <v-card>
        <AddASymptom :day="addDataDay" v-if="addDataType === LogTypes.symptoms" @close="closeDialogAndBottomSheet" />
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
