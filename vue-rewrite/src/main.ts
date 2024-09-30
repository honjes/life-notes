import { createApp } from "vue"
import App from "./App.vue"
import router from "@/router"

/* Pinia Store */
import { createPinia } from "pinia"

const pinia = createPinia()

import {
  IonContent,
  IonHeader,
  IonIcon,
  IonicVue,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/vue"

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
 * Vuetify
 */
import "material-design-icons-iconfont/dist/material-design-icons.css"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import { VTimePicker } from "vuetify/labs/VTimePicker"
import * as directives from "vuetify/directives"
import { aliases, md } from "vuetify/iconsets/md"
import { darkTheme, lightTheme } from "./theme"

const vuetify = createVuetify({
  components: { VTimePicker, ...components },
  directives,
  icons: {
    defaultSet: "md",
    aliases,
    sets: {
      md,
    },
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
})

const app = createApp(App).use(vuetify).use(IonicVue).use(router).use(i18n).use(pinia)

/* Ionic Components */
app.component("IonInfiniteScroll", IonInfiniteScroll)
app.component("IonInfiniteScrollContent", IonInfiniteScrollContent)
app.component("IonHeader", IonHeader)
app.component("IonToolbar", IonToolbar)
app.component("IonTitle", IonTitle)
app.component("IonContent", IonContent)
app.component("IonPage", IonPage)
app.component("IonIcon", IonIcon)

router.isReady().then(() => {
  app.mount("#app")
})
