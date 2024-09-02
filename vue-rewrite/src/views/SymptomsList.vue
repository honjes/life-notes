<script setup lang="ts">
import CreateSymptom from "@/components/Forms/CreateSymptom.vue"
import useSymptomStore from "@/store/symptom"
import { ISymptom } from "@/types/symptom"
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue"
import { ref } from "vue"
import { useI18n } from "vue-i18n"

// External Components
const symptomStore = useSymptomStore()
const { t } = useI18n()

// Variables
const symptomListItems = ref<ISymptom[]>([])
const showAddSymptomDialog = ref(false)

// Functions
function updateSymptoms(symptoms: ISymptom[]) {
  symptomListItems.value = symptoms
}

/*
 * Edits a symptom
 * @param symptom - symptom to edit
 * @TODO: add Logic
 */
function editSymptom(symptom: ISymptom) {}

/*
 * removes a symptom from the db
 * @param symptom - symptom to remove
 * @TODO: add Logic
 */
function deleteSymptom(symptom: ISymptom) {}

// Initalise symptom list
symptomStore.getSymptoms().then(returnedSymptoms => {
  updateSymptoms(returnedSymptoms)
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
                <v-icon size="large" class="hover:cursor-pointer" @click="editSymptom(symptom)">edit</v-icon>
                <v-icon size="large" class="hover:cursor-pointer" @click="deleteSymptom(symptom)">delete</v-icon>
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
              <CreateSymptom @close="showAddSymptomDialog = false" />
            </v-card>
          </template>
        </v-dialog>
      </ion-content>
    </ion-content>
  </ion-page>
</template>
