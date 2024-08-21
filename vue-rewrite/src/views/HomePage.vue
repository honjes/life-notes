<template>
  <IonPage>
    <IonContent :fullscreen="true">
      <IonList>
        <IonItem v-for="day in days" :key="day.date">
          <div class="ion-text-wrap">
            <h2>{{ day.date }}</h2>
          </div>
        </IonItem>
      </IonList>
      <IonInfiniteScroll @ionInfinite="getDayBatch">
        <IonInfiniteScrollContent></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { useDayStore } from "@/store/day"
import { IDay } from "@/types/day"
import { IonItem, IonList, InfiniteScrollCustomEvent } from "@ionic/vue"
import { ref } from "vue"

const store = useDayStore()

const days = ref<IDay[]>([])
const batchSize = ref(10)
const offset = ref(0)

async function getDayBatch(ev?: InfiniteScrollCustomEvent) {
  const dayBatch = await store.getDays(batchSize.value, offset.value)

  days.value = days.value.concat(dayBatch)
  offset.value += batchSize.value
  if (ev != null) {
    ev.target.complete()
  }
}

getDayBatch()
</script>

