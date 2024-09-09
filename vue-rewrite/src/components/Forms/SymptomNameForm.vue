<script lang="ts" setup>
import { useI18n } from "vue-i18n"
import { ref } from "vue"
import { useSymptomStore } from "@/store/symptom"
import { createToast } from "@/utils/vue"
import { ISymptom } from "@/types/symptom"

// Vue Definitions
const emits = defineEmits(["close"])
const props = defineProps<{
  edit?: boolean
  symptom?: ISymptom
}>()

// external components
const { t } = useI18n()
const symptomStore = useSymptomStore()

// Variables
// Form values
const name = ref<string>()

// Functions
async function createNewSymptom() {
  if (name.value == null || name.value === "") {
    await createToast(t("FORM_REQUIRED", { field_name: t("NAME"), data_type: t("SYMPTOM") }), 2000, "error")
    return
  }
  symptomStore
    .createNewSymptom(name.value)
    .then(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("ADD"),
          successfully_failuar: t("SUCCESSFULLY"),
          data_type: t("SYMPTOM"),
          name: name.value,
        }),
        2000,
        "success"
      )
      emits("close")
    })
    .catch(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("ADD"),
          successfully_failuar: t("FAILED"),
          data_type: t("SYMPTOM"),
          name: name.value,
        }),
        2000,
        "error"
      )
    })
}

async function editSymptom() {
  if (name.value == null || name.value === "") {
    await createToast(t("FORM_REQUIRED", { field_name: t("NAME"), data_type: t("SYMPTOM") }), 2000, "error")
    return
  }
  symptomStore
    .editSymptom(props.symptom?.key || "", name.value)
    .then(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("EDIT"),
          successfully_failuar: t("SUCCESSFULLY"),
          data_type: t("SYMPTOM"),
          name: name.value,
        }),
        2000,
        "success"
      )
      emits("close")
    })
    .catch(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("EDIT"),
          successfully_failuar: t("FAILED"),
          data_type: t("SYMPTOM"),
          name: name.value,
        }),
        2000,
        "error"
      )
    })
}

// init name
if (props.edit) {
  name.value = props.symptom?.label || ""
}
</script>

<template>
  <v-card>
    <div v-if="!edit">
      <v-card-title>
        <h3 class="text-xl">
          {{ t("ADD_SYMPTOM") }}
        </h3>
      </v-card-title>
      <v-card-text>
        <v-form class="flex flex-col gap-4">
          <v-text-field v-model="name" :label="t('SYMPTOM')" required hide-details />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="emits('close')">{{ t("CANCEL") }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="createNewSymptom">{{ t("SAVE") }}</v-btn>
      </v-card-actions>
    </div>
    <div v-else>
      <v-card-title>
        <h3 class="text-xl">
          {{ t("EDIT_SYMPTOM") }}
        </h3>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="name" :label="t('SYMPTOM')" required></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="text" @click="emits('close')">{{ t("CANCEL") }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="editSymptom">{{ t("SAVE") }}</v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>
