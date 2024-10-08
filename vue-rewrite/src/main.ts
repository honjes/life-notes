import { createApp } from "vue"
import App from "./App.vue"
import router from "@/router"

/* Pinia Store */
import { createPinia } from "pinia"

const pinia = createPinia()

import { IonicVue } from "@ionic/vue"

/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css"

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
import Accordion from "primevue/accordion"
import AccordionContent from "primevue/accordioncontent"
import AccordionHeader from "primevue/accordionheader"
import AccordionPanel from "primevue/accordionpanel"
import Panel from "primevue/panel"

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
app.component("Accordion", Accordion)
app.component("AccordionPanel", AccordionPanel)
app.component("AccordionHeader", AccordionHeader)
app.component("AccordionContent", AccordionContent)
app.component("Panel", Panel)

router.isReady().then(() => {
  app.mount("#app")
})
