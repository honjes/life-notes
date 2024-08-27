<script lang="ts" setup>
import { IDay } from "@/types/day"
import { ref } from "vue"
import { useI18n } from "vue-i18n"

const props = defineProps<{
  day: IDay
}>()

const { t } = useI18n()

const items = ref([
  { title: t("ADD_SYMPTOM_BOTTOMSHEET"), props: { prependIcon: "spa" } },
  { title: t("ADD_MEAL_BOTTOMSHEET"), props: { prependIcon: "dinner_dining" } },
  { title: t("ADD_DRUG_BOTTOMSHEET"), props: { prependIcon: "medication" } },
  { title: t("ADD_NOTE_BOTTOMSHEET"), props: { prependIcon: "event_note" } },
])
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
              <div class="flex flex-row justify-left gap-4 ml-4">
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
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-flow: row;
}
</style>
