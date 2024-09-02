<script setup lang="ts">
/*
 * Home page displays a list of all days and the symptoms of that day also has possability to add data to a day
 */
import { useDayStore } from "@/store/day"
import { IDay } from "@/types/day"
import DayView from "@/components/DayView.vue"
import { IonItem, IonList, InfiniteScrollCustomEvent } from "@ionic/vue"
import { ref } from "vue"

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

getDayBatch()
</script>

<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <IonList>
        <IonItem v-for="day in days" :key="day.date">
          <DayView :day="day" />
        </IonItem>
      </IonList>
      <IonInfiniteScroll @ionInfinite="getDayBatch">
        <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </IonContent>
  </IonPage>
</template>
