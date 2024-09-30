<script setup lang="ts">
/*
 * Home page displays a list of all days and the symptoms of that day also has possability to add data to a day
 */
import { useDayStore } from "@/store/day"
import { IDay } from "@/types/day"
import DayView from "@/components/DayView.vue"
import { InfiniteScrollCustomEvent, IonInfiniteScroll, IonContent, IonInfiniteScrollContent } from "@ionic/vue"
import { onBeforeMount, ref } from "vue"
import { buildDayView } from "@/utils"

const dayStore = useDayStore()

const days = ref<IDay[]>([])
const batchSize = ref(10)
const offset = ref(0)

async function getDayBatch(ev?: InfiniteScrollCustomEvent) {
  const dayBatch = await dayStore.getDays(batchSize.value, offset.value)

  days.value = days.value.concat(dayBatch)
  offset.value += batchSize.value
  if (ev != null) {
    ev.target.complete()
  }
}

// Init
onBeforeMount(() => {
  getDayBatch()
  // Subscribe to store changes
  dayStore.$subscribe(() => {
    // update the days that have been updated
    dayStore.dayUpdate.forEach(async day => {
      const dayIndex = days.value.findIndex(d => d.date === day)
      if (dayIndex != -1) {
        days.value[dayIndex] = await dayStore.getDay(day)
      }
    })
  })
})
</script>

<template>
  <IonContent :fullscreen="true">
    <article>
      <div v-for="day in days" :key="day.date">
        <DayView :day="buildDayView(day)" />
      </div>
    </article>
    <IonInfiniteScroll @ionInfinite="getDayBatch">
      <IonInfiniteScrollContent></IonInfiniteScrollContent>
    </IonInfiniteScroll>
  </IonContent>
</template>
