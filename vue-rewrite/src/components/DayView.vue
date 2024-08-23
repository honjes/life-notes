<script lang="ts" setup>
import { IDay } from "@/types/day"
import { ref } from "vue"

const props = defineProps<{
  day: IDay
}>()

const items = ref([
  { title: $t("ADD_SYMPTOM_BOTTOMSHEET"), props: { prependIcon: "spa" } },
  { title: "Log", props: { prependIcon: "event_note" } },
  { title: "Med", props: { prependIcon: "medication" } },
  { title: "Meal", props: { prependIcon: "restaurant_menu" } },
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
                <v-list-item-icon>
                  <v-icon>{{ item.props.prependIcon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
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
