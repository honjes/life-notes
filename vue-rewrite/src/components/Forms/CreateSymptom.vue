<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { ref } from "vue"
import { useSymptomStore } from "@/store/symptom"
import { useRouter } from "vue-router"
import { createToast } from "@/utils/vue"

// Vue Definitions
const emits = defineEmits(["close"])

// external components
const { t } = useI18n()
const symptomStore = useSymptomStore()

// Variables
// Form values
const name = ref<string>()

// Functions
async function createNewSymptom() {
  if (name.value == null || name.value === "") {
    await createToast(t("SYMPTOM_NAME_REQUIRED"), 2000, "error")
    return
  }
  symptomStore
    .createNewSymptom(name.value)
    .then(async () => {
      await createToast(t("SYMPTOM_ACTION_SUCCESS", { action: t("ADD"), name: name.value }), 2000, "success")
      emits("close")
    })
    .catch(async () => {
      await createToast(t("SYMPTOM_ACTION_ERROR", { action: t("ADD"), name: name.value }), 2000, "error")
    })
}
</script>

<template>
  <v-card-title>
    <h3 class="text-xl">
      {{ t("ADD_SYMPTOM") }}
    </h3>
  </v-card-title>
  <v-card-text>
    <v-form>
      <v-text-field v-model="name" :label="t('SYMPTOM')" required></v-text-field>
    </v-form>
  </v-card-text>
  <v-card-actions props>
    <v-btn variant="text" @click="emits('close')">Cancel</v-btn>
    <v-spacer></v-spacer>
    <v-btn variant="text" @click="createNewSymptom">Save</v-btn>
  </v-card-actions>
</template>
