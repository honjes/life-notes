import { createApp } from "vue"
import App from "./App.vue"
import router from "@/router"

/* Pinia Store */
import { createPinia } from "pinia"

const pinia = createPinia()

import { IonicVue } from "@ionic/vue"

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css"

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css"
import "@ionic/vue/css/structure.css"
import "@ionic/vue/css/typography.css"

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css"
import "@ionic/vue/css/float-elements.css"
import "@ionic/vue/css/text-alignment.css"
import "@ionic/vue/css/text-transformation.css"
import "@ionic/vue/css/flex-utils.css"
import "@ionic/vue/css/display.css"

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
import "@ionic/vue/css/palettes/dark.system.css"

/* Theme variables */
import "./theme/index.scss"

/* Localization */
import { createI18n } from "vue-i18n"
import en from "./locales/en.json"
import fr from "./locales/fr.json"

const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  legacy: false,
  messages: {
    en: en,
    fr: fr,
  },
})

/**
 * PrimeVue
 */
import PrimeVue from "primevue/config"
import "primeicons/primeicons.css"
import Button from "primevue/button"
import Drawer from "primevue/drawer"
import { themePreset } from "./theme/theme"
import Dialog from "primevue/dialog"

const app = createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: themePreset,
      options: {
        cssLayer: {
          name: "primevue",
          order: "tailwind-base, primevue, tailwind-components",
        },
      },
    },
  })
  .use(IonicVue)
  .use(router)
  .use(i18n)
  .use(pinia)

// PrimeVue Components
app.component("PrimeButton", Button)
app.component("Drawer", Drawer)
app.component("PrimeDialog", Dialog)

router.isReady().then(() => {
  app.mount("#app")
})
