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
import { themePreset } from "./theme"
import Dialog from "primevue/dialog"
import DatePicker from "primevue/datepicker"
import Select from "primevue/select"
import FloatLabel from "primevue/floatlabel"
import Slider from "primevue/slider"
import Divider from "primevue/divider"
import InputText from "primevue/inputtext"
import InputNumber from "primevue/inputnumber"
import AutoComplete from "primevue/autocomplete"
import Column from "primevue/column"
import DataTable from "primevue/datatable"

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
app.component("PrimeSelect", Select)
app.component("Drawer", Drawer)
app.component("PrimeDialog", Dialog)
app.component("DatePicker", DatePicker)
app.component("FloatLabel", FloatLabel)
app.component("Slider", Slider)
app.component("Divider", Divider)
app.component("InputText", InputText)
app.component("InputNumber", InputNumber)
app.component("AutoComplete", AutoComplete)
app.component("DataTable", DataTable)
app.component("Column", Column)

router.isReady().then(() => {
  app.mount("#app")
})
