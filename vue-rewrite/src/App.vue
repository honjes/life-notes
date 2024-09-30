<script setup lang="ts">
import { IonApp } from "@ionic/vue"
import { useMainStore } from "./store"
import { onBeforeMount } from "vue"
import MainMenu from "./views/MainMenu.vue"

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
  <IonApp>
    <MainMenu />
    <router-view />
  </IonApp>
</template>
