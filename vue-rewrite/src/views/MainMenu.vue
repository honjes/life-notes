<script setup lang="ts">
/*
 * Header on each page
 * @TODO: make icons bigger
 */
import { IonHeader, useIonRouter } from "@ionic/vue"

const router = useIonRouter()
</script>

<template>
  <IonHeader>
    <!-- eslint-disable vue/no-deprecated-slot-attribute -->
    <div class="flex flex-row w-full justify-between p-5 bg-slate-500">
      <div class="flex flex-row">
        <v-icon size="large" @click="router.push({ name: 'Home' })">calendar_view_day</v-icon>
        <v-icon size="large" @click="router.push({ name: 'Calendar' })">apps</v-icon>
        <v-icon size="large" @click="router.push({ name: 'Symptoms' })">spa</v-icon>
      </div>
      <div class="flex flex-row">
        <v-icon size="large" @click="router.push({ name: 'Help' })">help</v-icon>
        <v-icon size="large" @click="router.push({ name: 'Settings' })">settings</v-icon>
      </div>
    </div>
  </IonHeader>
</template>
