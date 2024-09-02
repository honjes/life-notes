<script setup lang="ts">
import CreateEditSymptom from "@/components/Forms/CreateEditSymptom.vue"
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
const showEditSymptomDialog = ref(false)
const symptomToEdit = ref<ISymptom>()

// Functions
/*
 * Edits a symptom
 * @param symptom - symptom to edit
 * @TODO: add Logic
 */
function editSymptom(symptom: ISymptom) {}

// Function to show edit symptom dialog
function showEditSymptom(symptom: ISymptom) {
  symptomToEdit.value = symptom
  showEditSymptomDialog.value = true
}

/*
 * removes a symptom from the db
 * @param symptom - symptom to remove
 * @TODO: add Logic
 */
function deleteSymptom(symptom: ISymptom) {}

// Initalise symptom list
symptomStore.getSymptoms().then(returnedSymptoms => {
  symptomListItems.value = returnedSymptoms
})
// Subscribe to store changes and update symptom list
symptomStore.$subscribe(() => {
  console.log("symptom store changed")
  symptomStore.getSymptoms().then(returnedSymptoms => {
    symptomListItems.value = returnedSymptoms
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
                <v-icon size="large" class="hover:cursor-pointer" @click="showEditSymptom(symptom)"> edit </v-icon>
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
              <CreateEditSymptom @close="showAddSymptomDialog = false" />
            </v-card>
          </template>
        </v-dialog>
        <v-dialog v-model="showEditSymptomDialog" max-width="auto">
          <template v-slot:default>
            <v-card>
              <CreateEditSymptom
                edit
                :symptom="symptomToEdit"
                @edit="(symptom: ISymptom) => editSymptom(symptom)"
                @close="showEditSymptomDialog = false"
              />
            </v-card>
          </template>
        </v-dialog>
      </ion-content>
    </ion-content>
  </ion-page>
</template>
