<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { ref } from "vue"

// Vue Definitions
const model = defineModel<string>()

// external components
const { t } = useI18n()

// Variables
const menu2 = ref(false)
</script>

<template>
  <v-text-field v-model="model" :active="menu2" :focus="menu2" :label="t('TIME')" readonly hide-details>
    <v-menu
      v-model="menu2"
      :close-on-content-click="false"
      activator="parent"
      location="center"
      transition="scale-transition"
    >
      <v-time-picker v-if="menu2" format="24hr" v-model="model" full-width></v-time-picker>
    </v-menu>
  </v-text-field>
</template>
