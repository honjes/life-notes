<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { DataTypes, ISymptomOverview, IMeal, IMedOverview, INoteOverview } from "@/types"
import { onBeforeMount, ref } from "vue"
import { format } from "date-fns"
import { dateFormat, timeFormat } from "@/utils"

// Vue Definitions
const emits = defineEmits<{
  (e: "close"): void
  (e: "edit", data: INoteOverview | IMedOverview | IMeal | ISymptomOverview): void
}>()
const props = defineProps<{
  date: string
  data: INoteOverview | IMedOverview | IMeal | ISymptomOverview
}>()
const visible = defineModel("visible")

// external components
const { t } = useI18n()

// Variables
const header = ref("")

onBeforeMount(() => {
  switch (props.data.type) {
    case "symptoms":
      header.value = `${t("SYMPTOM")} - ${(props.data as ISymptomOverview).label}`
      break
    case "meds":
      header.value = `${t("MED")} - ${(props.data as IMedOverview).key}`
      break
    case "meals":
      header.value = `${t("MEAL")} - ${(props.data as IMeal).key}`
      break
    case "note":
      header.value = `${t("NOTE")} - ${(props.data as INoteOverview).key}`
      break
  }
})
</script>

<template>
  <PrimeDialog v-model:visible="visible" :closable="false" :draggable="false">
    <template #header>
      <h3 class="capitalised text-2xl">{{ header }}</h3>
    </template>
    <div class="flex flex-col gap-2">
      <div v-if="data.type === DataTypes.symptoms">
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("DATE") }}:</div>
          <div class="w-1/2">{{ format(new Date(`${date} ${data.time}`), `${dateFormat} ${timeFormat}`) }}</div>
        </div>
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("SYMPTOM") }}:</div>
          <div class="w-1/2">{{ (data as ISymptomOverview).label }}</div>
        </div>
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("PAIN") }}:</div>
          <div class="w-1/2">{{ (data as ISymptomOverview).pain }}/5</div>
        </div>
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("DETAIL") }}:</div>
          <div class="w-1/2">{{ (data as ISymptomOverview).detail }}</div>
        </div>
      </div>
      <div v-else-if="data.type === DataTypes.meds">
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("DATE") }}:</div>
          <div class="w-1/2">{{ format(new Date(`${date} ${data.time}`), `${dateFormat} ${timeFormat}`) }}</div>
        </div>
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("MED") }}:</div>
          <div class="w-1/2">{{ (data as IMedOverview).key }}</div>
        </div>
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("QUANTITY") }}:</div>
          <div class="w-1/2">{{ (data as IMedOverview).quantity }}</div>
        </div>
      </div>
      <div v-else-if="data.type === DataTypes.meals">
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("DATE") }}:</div>
          <div class="w-1/2">{{ format(new Date(`${date} ${data.time}`), `${dateFormat} ${timeFormat}`) }}</div>
        </div>
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("MEAL") }}:</div>
          <div class="w-1/2">{{ (data as IMeal).key }}</div>
        </div>
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("DETAIL") }}:</div>
          <div class="w-1/2">{{ (data as IMeal).detail }}</div>
        </div>
      </div>
      <div v-else-if="data.type === DataTypes.note">
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("DATE") }}:</div>
          <div class="w-1/2">{{ format(new Date(`${date} ${data.time}`), `${dateFormat} ${timeFormat}`) }}</div>
        </div>
        <div class="flex flex-row gap-2">
          <div class="w-1/2 font-bold">{{ t("NOTE") }}:</div>
          <div class="w-1/2">{{ (data as INoteOverview).detail }}</div>
        </div>
      </div>
    </div>
    <template #footer>
      <PrimeButton @click="emits('close')">{{ t("CANCEL") }}</PrimeButton>
      <PrimeButton @click="emits('edit', data)">{{ t("EDIT") }}</PrimeButton>
    </template>
  </PrimeDialog>
</template>
