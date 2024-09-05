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
import { DateValues, IDay } from "@/types/day"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import AddASymptom from "@/components/Forms/AddASymptom.vue"

// Vue Defenitions
const props = defineProps<{
  day: IDay
}>()

// External Components
const { t } = useI18n()

// Variables
const bottomSheetItems = ref<{ title: string; type: DateValues; props: any }[]>([
  { title: t("ADD_SYMPTOM_BOTTOMSHEET"), type: DateValues.symptoms, props: { prependIcon: "spa" } },
  { title: t("ADD_MEAL_BOTTOMSHEET"), type: DateValues.meals, props: { prependIcon: "dinner_dining" } },
  { title: t("ADD_DRUG_BOTTOMSHEET"), type: DateValues.meds, props: { prependIcon: "medication" } },
  { title: t("ADD_NOTE_BOTTOMSHEET"), type: DateValues.note, props: { prependIcon: "event_note" } },
])
const showAddDataDialog = ref(false)
const addDataType = ref<DateValues>(DateValues.symptoms)
const addDataDay = ref<string>("")
const showBottomSheet = ref(false)

// Functions
// Function to close the dialog and the bottom sheet
function closeDialogAndBottomSheet() {
  showAddDataDialog.value = false
  showBottomSheet.value = false
}
</script>

<template>
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
                class="flex flex-row justify-left gap-4 ml-4 hover:cursor-pointer"
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
  <v-dialog v-model="showAddDataDialog" max-width="auto">
    <template v-slot:default>
      <v-card>
        <AddASymptom :day="addDataDay" v-if="addDataType === DateValues.symptoms" @close="closeDialogAndBottomSheet" />
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
