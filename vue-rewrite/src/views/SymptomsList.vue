<script setup lang="ts">
import { CreateEditSymptom } from "@/components/Forms"
import useSymptomStore from "@/store/symptom"
import { ISymptom } from "@/types/symptom"
import { createToast } from "@/utils/vue"
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue"
import { onBeforeMount, ref } from "vue"
import { useI18n } from "vue-i18n"

// External Components
const symptomStore = useSymptomStore()
const { t } = useI18n()

// Variables
const symptomListItems = ref<ISymptom[]>([])
const showAddSymptomDialog = ref(false)
const showEditSymptomDialog = ref(false)
const showDeleteSymptomDialog = ref(false)
const symptomToEdit = ref<ISymptom>()
const symptomToDelete = ref<ISymptom>()

// Functions
// Function to show edit symptom dialog
function showEditSymptom(symptom: ISymptom) {
  symptomToEdit.value = symptom
  showEditSymptomDialog.value = true
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
  if (symptom == null) {
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
  <ion-page>
    <ion-content>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title class="flex justify-center" size="large">{{ t("SYMPTOMS_TITLE") }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <v-list v-if="symptomListItems.length > 0">
          <v-list-item v-for="symptom in symptomListItems" :key="symptom.key">
            <div class="flex flex-row justify-between">
              <div>
                <v-list-item-title>{{ symptom.label }}</v-list-item-title>
              </div>
              <div class="flex flex-row items-center">
                <v-icon size="large" class="hover:cursor-pointer" @click="showEditSymptom(symptom)">edit</v-icon>
                <v-icon size="large" class="hover:cursor-pointer" @click="showDeleteSymptom(symptom)">delete</v-icon>
              </div>
            </div>
          </v-list-item>
        </v-list>
        <div v-else class="flex flex-row justify-center px-4">
          {{ t("EMPTY_SYMPTOMS_1") }}
        </div>
        <div class="flex p-4 justify-center">
          <v-btn @click="showAddSymptomDialog = true">{{ t("ADD_SYMPTOM") }}</v-btn>
        </div>
        <v-dialog v-model="showAddSymptomDialog" max-width="auto">
          <template v-slot:default>
            <v-card>
              <CreateEditSymptom @close="showAddSymptomDialog = false" />
            </v-card>
          </template>
        </v-dialog>
        <v-dialog v-model="showEditSymptomDialog" max-width="auto">
          <template v-slot:default>
            <v-card>
              <CreateEditSymptom edit :symptom="symptomToEdit" @close="showEditSymptomDialog = false" />
            </v-card>
          </template>
        </v-dialog>
        <v-dialog v-model="showDeleteSymptomDialog" max-width="auto">
          <template v-slot:default>
            <v-card>
              <v-card-title>
                <h3 class="text-xl">
                  {{ t("DELETE_SYMPTOM_DIALOG_TITLE", { symptom: symptomToDelete?.label || "" }) }}
                </h3>
              </v-card-title>
              <v-card-text>
                <p>{{ t("DELETE_SYMPTOM_DIALOG_CONTENT") }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn variant="text" @click="showDeleteSymptomDialog = false">{{ t("CANCEL") }}</v-btn>
                <v-spacer></v-spacer>
                <v-btn variant="text" @click="deleteSymptom(symptomToDelete)">{{ t("DELETE") }}</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>
      </ion-content>
    </ion-content>
  </ion-page>
</template>
