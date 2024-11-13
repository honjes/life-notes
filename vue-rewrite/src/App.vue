<script setup lang="ts">
import { IonApp, IonContent } from "@ionic/vue"
import { useMainStore } from "./store"
import { onBeforeMount } from "vue"
import MainMenu from "./views/MainMenu.vue"
import { storeToRefs } from "pinia"

// External Components
const mainStore = useMainStore()

const { initalised } = storeToRefs(mainStore)

// Init
// initalise main store for settings
if (!mainStore.initalised) {
  onBeforeMount(() => {
    const unsubscribe = mainStore.$subscribe(() => {
      if (mainStore.initalised) {
        unsubscribe()
      }
    })
  })
}
</script>

<template>
  <IonApp>
    <MainMenu />
    <router-view v-if="initalised" />
    <IonContent v-else>
      <div class="mt-8 flex flex-row items-center">
        <ProgressSpinner
          style="width: 50px; height: 50px"
          strokeWidth="8"
          fill="transparent"
          animationDuration=".5s"
          aria-label="Custom ProgressSpinner"
        />
      </div>
    </IonContent>
  </IonApp>
</template>
