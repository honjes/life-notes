<script setup lang="ts">
import { SymptomNameForm } from "@/components/Forms"
import useSymptomStore from "@/store/symptom"
import { ISymptom } from "@/types/symptom"
import { createToast } from "@/utils/vue"
import { IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue"
import { onBeforeMount, ref } from "vue"
import { useI18n } from "vue-i18n"

// External Components
const symptomStore = useSymptomStore()
const { t } = useI18n()

// Variables
const symptomListItems = ref<ISymptom[]>([])
const showAddSymptomDialog = ref(false)
const shouldEdit = ref(false)
const showDeleteSymptomDialog = ref(false)
const symptomToEdit = ref<ISymptom>()
const symptomToDelete = ref<ISymptom>()

// Functions
// Function to show edit symptom dialog
function showEditSymptom(symptom: ISymptom) {
  symptomToEdit.value = symptom
  shouldEdit.value = true
  showAddSymptomDialog.value = true
}

// Function to show delete symptom dialog
function showDeleteSymptom(symptom: ISymptom) {
  symptomToDelete.value = symptom
  showDeleteSymptomDialog.value = true
}

/*
 * removes a symptom from the db
 * @param symptom - symptom to remove
 */
async function deleteSymptom(symptom?: ISymptom) {
  if (!symptom) {
    await createToast(
      t("ACTION_TOAST", {
        action: t("DELETE"),
        successfully_failuar: t("FAILED"),
        data_type: t("SYMPTOM"),
        name: "???",
      }),
      2000,
      "error"
    )
    return
  }
  symptomStore
    .deleteSymptom(symptom.key)
    .then(async () => {
      await createToast(t("DELETE_EVENT_DIALOG_TITLE", { type: t("SYMPTOM") }), 2000, "success")
      symptomListItems.value = symptomListItems.value.filter(s => s.key !== symptom.key)
      showDeleteSymptomDialog.value = false
    })
    .catch(async () => {
      await createToast(
        t("ACTION_TOAST", {
          action: t("DELETE"),
          successfully_failuar: t("FAILED"),
          data_type: t("SYMPTOM"),
          name: symptom.label,
        }),
        2000,
        "error"
      )
    })
}

/**
 * Updates the symptom list
 */
async function updateSymptomList() {
  const symptoms = await symptomStore.getSymptoms()
  symptomListItems.value = symptoms
}

/**
 * Closes the dialog
 */
function closeDialog() {
  showAddSymptomDialog.value = false
  shouldEdit.value = false
}

// Initalise symptom list
onBeforeMount(() => {
  updateSymptomList()

  // Subscribe to store changes and update symptom list
  symptomStore.$subscribe(() => {
    updateSymptomList()
  })
})
</script>

<template>
  <ion-content>
    <ion-header>
      <ion-toolbar>
        <ion-title class="flex justify-center" size="large">{{ t("SYMPTOMS_TITLE") }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="symptom-list">
      <DataTable :value="symptomListItems" v-if="symptomListItems.length > 0">
        <Column field="label" :header="t('NAME')" :style="{ width: '70%' }" />
        <Column>
          <template #body="{ data }">
            <div class="w-full text-right">
              <i class="material-icons" @click="showEditSymptom(data)">edit</i>
              <i class="material-icons" @click="showDeleteSymptom(data)">delete</i>
            </div>
          </template>
        </Column>
      </DataTable>
      <div v-else class="flex flex-row justify-center px-4">
        {{ t("EMPTY_SYMPTOMS_1") }}
      </div>
      <div class="flex justify-center p-4">
        <PrimeButton @click="showAddSymptomDialog = true">{{ t("ADD_SYMPTOM") }}</PrimeButton>
      </div>
      <SymptomNameForm
        v-if="showAddSymptomDialog"
        v-model:visible="showAddSymptomDialog"
        @close="closeDialog"
        :edit="shouldEdit"
        :symptom="symptomToEdit"
      />
      <PrimeDialog v-model:visible="showDeleteSymptomDialog" :closable="false" modal>
        <template #header>
          <h3 class="text-xl">
            {{ t("DELETE_SYMPTOM_DIALOG_TITLE", { symptom: symptomToDelete?.label || "" }) }}
          </h3>
        </template>
        <p>{{ t("DELETE_SYMPTOM_DIALOG_CONTENT") }}</p>
        <template #footer>
          <div class="flex w-full flex-row justify-between">
            <PrimeButton @click="showDeleteSymptomDialog = false">{{ t("CANCEL") }}</PrimeButton>
            <PrimeButton @click="deleteSymptom(symptomToDelete)">{{ t("DELETE") }}</PrimeButton>
          </div>
        </template>
      </PrimeDialog>
    </ion-content>
  </ion-content>
</template>

<style lang="scss">
.symptom-list {
  .p-datatable-header-cell,
  .p-datatable-tbody > tr {
    background-color: transparent;
  }
}
</style>
