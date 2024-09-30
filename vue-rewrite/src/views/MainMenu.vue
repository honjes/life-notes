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
    <div class="flex flex-row w-full justify-between p-5">
      <div class="flex flex-row">
        <i class="material-icons" @click="router.push({ name: 'Home' })"> calendar_view_day </i>
        <i class="material-icons" @click="router.push({ name: 'Calendar' })"> apps </i>
        <i class="material-icons" @click="router.push({ name: 'Symptoms' })"> spa </i>
      </div>
      <div class="flex flex-row">
        <i class="material-icons" @click="router.push({ name: 'Help' })">help</i>
        <i class="material-icons" @click="router.push({ name: 'Settings' })">settings</i>
      </div>
    </div>
  </IonHeader>
</template>
