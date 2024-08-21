<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="top">
        <ion-tab-button tab="tab1" href="/Home">
          <ion-icon aria-hidden="true" :icon="triangle" />
        </ion-tab-button>
        <ion-tab-button tab="tab2" href="/tab2">
          <ion-icon aria-hidden="true" :icon="ellipse" />
        </ion-tab-button>
        <ion-tab-button tab="tab3" href="/tab3">
          <ion-icon aria-hidden="true" :icon="square" />
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonIcon, IonPage, IonRouterOutlet } from "@ionic/vue"
import { ellipse, square, triangle } from "ionicons/icons"
</script>

