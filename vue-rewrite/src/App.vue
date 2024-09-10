<script setup lang="ts">
import { IonApp, IonRouterOutlet } from "@ionic/vue"
import { useMainStore } from "./store"
import { onBeforeMount } from "vue"

// External Components
const mainStore = useMainStore()

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
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
