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
    <div class="bg-surface-50 dark:bg-surface-700 flex w-full flex-row justify-between p-5">
      <div class="flex flex-row">
        <PrimeButton link>
          <i class="material-icons" @click="router.push({ name: 'Home' })"> calendar_view_day </i>
        </PrimeButton>
        <PrimeButton link>
          <i class="material-icons" @click="router.push({ name: 'Calendar' })"> apps </i>
        </PrimeButton>
        <PrimeButton link><i class="material-icons" @click="router.push({ name: 'Symptoms' })"> spa </i></PrimeButton>
      </div>
      <div class="flex flex-row">
        <PrimeButton link><i class="material-icons" @click="router.push({ name: 'Help' })">help</i></PrimeButton>
        <PrimeButton link>
          <i class="material-icons" @click="router.push({ name: 'Settings' })">settings</i>
        </PrimeButton>
      </div>
    </div>
  </IonHeader>
</template>
