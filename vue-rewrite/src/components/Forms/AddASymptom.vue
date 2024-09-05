<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { ref } from "vue"
import { format } from "date-fns"
import { useSymptomStore } from "@/store/symptom"
import { ISymptom } from "@/types/symptom"
import { useRouter } from "vue-router"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  day: string
}>()

// external components
const { t } = useI18n()
const symptomStore = useSymptomStore()
const router = useRouter()

// Variables
const monthShort = ref(format(new Date(props.day), "MMM"))
const day = ref(format(new Date(props.day), "dd"))
const symptomList = ref<ISymptom[]>([])

// Form values
const time = ref(format(new Date(props.day), "HH:mm"))
const menu2 = ref(false)
const symptom = ref<ISymptom>()
const pain = ref(0)
const details = ref("")

// Function to go to add a symptom
function goToAddASymptom() {
  emits("close")
  router.push({ name: "Symptom List" })
}

// Initalise symptom list
symptomStore.getSymptoms().then(symptoms => {
  symptomList.value = symptoms
})
</script>

<template>
  <v-card-title>
    <h3 class="text-xl">
      {{ t("ADD_EVENT_DIALOG_TITLE", { type: t("SYMPTOM"), monthShort, day }) }}
    </h3>
  </v-card-title>
  <v-card-text>
    <v-form>
      <v-text-field v-model="time" :active="menu2" :focus="menu2" :label="t('TIME')" readonly>
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          activator="parent"
          location="center"
          transition="scale-transition"
        >
          <v-time-picker v-if="menu2" v-model="time" full-width></v-time-picker>
        </v-menu>
      </v-text-field>
      <div class="flex flex-row gap-4">
        <v-select v-model="symptom" :items="symptomList" item-value="label" item-title="label" :label="t('SYMPTOM')">
          <template v-slot:no-data>
            <v-list-item>
              {{ t("EMPTY_SYMPTOMS_1") }}
            </v-list-item>
          </template>
        </v-select>
        <v-btn density="compact" size="large" icon="add" class="mt-3 h-fit" @click="goToAddASymptom" />
      </div>
      <div class="flex flex-row gap-4">
        <v-slider :label="t('PAIN')" v-model="pain" min="0" max="5" step="1" thumb-label></v-slider>
        {{ pain }}
      </div>
      <v-text-field v-model="details" :label="t('DETAIL')"></v-text-field>
    </v-form>
  </v-card-text>
  <v-card-actions props>
    <v-btn @click="emits('close')">{{ t("CANCEL") }}</v-btn>
    <v-spacer></v-spacer>
    <v-btn @click="addSymptomToDay">{{ t("ADD") }}</v-btn>
  </v-card-actions>
</template>
