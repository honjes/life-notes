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
            <ion-tab-button tab="tab3" href="/Symptoms">
              <v-icon size="large">spa</v-icon>
            </ion-tab-button>
          </div>
          <div class="flex flex-row">
            <ion-tab-button tab="tab4" href="/tab4">
              <v-icon size="large">help</v-icon>
            </ion-tab-button>
            <ion-tab-button tab="tab5" href="/tab5">
              <v-icon size="large">settings</v-icon>
            </ion-tab-button>
          </div>
        </div>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonPage, IonRouterOutlet } from "@ionic/vue"
</script>
