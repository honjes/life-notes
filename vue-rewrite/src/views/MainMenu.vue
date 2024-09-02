<script setup lang="ts">
/*
 * Header on each page
 * @TODO: make icons bigger
 */
import { IonTabBar, IonTabButton, IonTabs, IonPage, IonRouterOutlet } from "@ionic/vue"
</script>

<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="top">
        <div class="flex flex-row w-full justify-between px-5">
          <div class="flex flex-row">
            <ion-tab-button tab="tab1" href="/Home">
              <v-icon size="large">calendar_view_day</v-icon>
            </ion-tab-button>
            <ion-tab-button tab="tab2" href="/calendar">
              <v-icon size="large">apps</v-icon>
            </ion-tab-button>
            <ion-tab-button tab="tab3" href="/symptom-list">
              <v-icon size="large">spa</v-icon>
            </ion-tab-button>
          </div>
          <div class="flex flex-row">
            <ion-tab-button tab="tab4" href="/help">
              <v-icon size="large">help</v-icon>
            </ion-tab-button>
            <ion-tab-button tab="tab5" href="/settings">
              <v-icon size="large">settings</v-icon>
            </ion-tab-button>
          </div>
        </div>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>
