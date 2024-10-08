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
const visible = defineModel<boolean>("visible")

// external components
const { t } = useI18n()
const symptomStore = useSymptomStore()

// Variables
// Form values
const name = ref<string>()

// Functions
/**
 * Creates or updates a symptom and emits the close event
 */
async function createUpdateSymptom() {
  if (name.value == null || name.value === "") {
    await createToast(t("FORM_REQUIRED", { field_name: t("NAME"), data_type: t("SYMPTOM") }), 2000, "error")
    return
  }

  if (props.edit) {
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
  } else {
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
}

// init name
if (props.edit) {
  name.value = props.symptom?.label || ""
}
</script>

<template>
  <PrimeDialog v-model:visible="visible" :closable="false" modal>
    <template #header>
      <h3 class="text-xl">
        {{ edit ? t("EDIT_SYMPTOM") : t("ADD_SYMPTOM") }}
      </h3>
    </template>
    <template #default>
      <form class="flex flex-col">
        <FloatLabel class="mt-6">
          <InputText v-model="name" id="name" />
          <label for="name">{{ t("SYMPTOM") }}</label>
        </FloatLabel>
      </form>
    </template>
    <template #footer>
      <div class="mt-2 flex w-full flex-row justify-between">
        <PrimeButton @click="emits('close')">{{ t("CANCEL") }}</PrimeButton>
        <PrimeButton @click="createUpdateSymptom">{{ t("SAVE") }}</PrimeButton>
      </div>
    </template>
  </PrimeDialog>
</template>
