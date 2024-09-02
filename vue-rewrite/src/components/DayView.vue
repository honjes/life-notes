<script lang="ts" setup>
import { DateValues, IDay } from "@/types/day"
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import AddASymptom from "@/components/Forms/AddASymptom.vue"

const props = defineProps<{
  day: IDay
}>()

const { t } = useI18n()

const items = ref<{ title: string; type: DateValues; props: any }[]>([
  { title: t("ADD_SYMPTOM_BOTTOMSHEET"), type: DateValues.symptoms, props: { prependIcon: "spa" } },
  { title: t("ADD_MEAL_BOTTOMSHEET"), type: DateValues.meals, props: { prependIcon: "dinner_dining" } },
  { title: t("ADD_DRUG_BOTTOMSHEET"), type: DateValues.meds, props: { prependIcon: "medication" } },
  { title: t("ADD_NOTE_BOTTOMSHEET"), type: DateValues.note, props: { prependIcon: "event_note" } },
])
const showDialog = ref(false)
const dialogContent = ref<DateValues>(DateValues.symptoms)
const showBottomSheet = ref(false)
function closeDialog() {
  showAddDataDialog.value = false
  showBottomSheet.value = false
</script>

<template>
  <div class="flex flex-row justify-between w-full">
    <div class="flex flex-row items-center">
      <h2 class="text-xl">{{ props.day.date }}</h2>
      <v-btn variant="text" icon="arrow_forward_ios" />
    </div>
    <div class="flex flex-row items-center">
      <v-bottom-sheet>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" icon="playlist_add" />
        </template>
        <v-card>
          <v-list>
            <v-list-item v-for="item in items" :key="item.title">
              <div
                class="flex flex-row justify-left gap-4 ml-4 hover:cursor-pointer"
                @click="
                  () => {
                    showDialog = true
                    dialogContent = item.type
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
  <v-dialog v-model="showDialog" max-width="auto">
    <template v-slot:default="{ isActive }">
      <v-card>
        <AddASymptom v-if="dialogContent === DateValues.symptoms" />
        <AddASymptom v-if="addDataType === DateValues.symptoms" @close="closeDialog" />
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
