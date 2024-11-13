<script setup lang="ts">
import { useDayStore, useMainStore } from "@/store"
import { IonContent } from "@ionic/vue"
import { onMounted, ref } from "vue"

// Store
const daystore = useDayStore()
const mainStore = useMainStore()

// variables
const selectedMonth = ref<Date>(new Date())
const selectedDate = ref<Date>(new Date())

// Theming
const customDatePicker = ref({
  header: {
    backgrond: "{surface.0}",
    padding: "0 10px",
  },
  date: {
    borderRadius: "1.25rem",
  },
  panel: {
    padding: "0",
    borderRadius: "0",
    background: "transparent",
  },
})

const theme = ref<Record<number, string>>({})

/**
 * update days of the selected month
 */
async function updateDayColors() {
  const dayOverview = await daystore.getMonthSymptomOverview(selectedMonth.value)

  dayOverview.forEach((day, index) => {
    theme.value[index + 1] = mainStore.settings.painColors[day.pain]
  })
}

onMounted(async () => {
  await updateDayColors()
})
</script>

<template>
  <ion-content :fullscreen="true">
    <DatePicker v-model="selectedDate" class="w-full" :dt="customDatePicker" :showOtherMonths="false" inline>
      <template #date="{ date: { day } }">
        <div>{{ day }}</div>
      </template>
    </DatePicker>
    <div class="flex flex-col gap-6 px-4">
      {{ theme[1] }}
    </div>
  </ion-content>
</template>

<style lang="scss">
.p-datepicker-day-view {
  tbody tr td {
    height: 3.5rem;
    vertical-align: top;
    > span {
      height: auto;
    }
    &:not(.p-datepicker-other-month) {
      &[aria-label="1"] {
        background-color: v-bind("theme[1]");
      }
      &[aria-label="2"] {
        background-color: v-bind("theme[2]");
      }
      &[aria-label="3"] {
        background-color: v-bind("theme[3]");
      }
      &[aria-label="4"] {
        background-color: v-bind("theme[4]");
      }
      &[aria-label="5"] {
        background-color: v-bind("theme[5]");
      }
      &[aria-label="6"] {
        background-color: v-bind("theme[6]");
      }
      &[aria-label="7"] {
        background-color: v-bind("theme[7]");
      }
      &[aria-label="8"] {
        background-color: v-bind("theme[8]");
      }
      &[aria-label="9"] {
        background-color: v-bind("theme[9]");
      }
      &[aria-label="10"] {
        background-color: v-bind("theme[10]");
      }
      &[aria-label="11"] {
        background-color: v-bind("theme[11]");
      }
      &[aria-label="12"] {
        background-color: v-bind("theme[12]");
      }
      &[aria-label="13"] {
        background-color: v-bind("theme[13]");
      }
      &[aria-label="14"] {
        background-color: v-bind("theme[14]");
      }
      &[aria-label="15"] {
        background-color: v-bind("theme[15]");
      }
      &[aria-label="16"] {
        background-color: v-bind("theme[16]");
      }
      &[aria-label="17"] {
        background-color: v-bind("theme[17]");
      }
      &[aria-label="18"] {
        background-color: v-bind("theme[18]");
      }
      &[aria-label="19"] {
        background-color: v-bind("theme[19]");
      }
      &[aria-label="20"] {
        background-color: v-bind("theme[20]");
      }
      &[aria-label="21"] {
        background-color: v-bind("theme[21]");
      }
      &[aria-label="22"] {
        background-color: v-bind("theme[22]");
      }
      &[aria-label="23"] {
        background-color: v-bind("theme[23]");
      }
      &[aria-label="24"] {
        background-color: v-bind("theme[24]");
      }
      &[aria-label="25"] {
        background-color: v-bind("theme[25]");
      }
      &[aria-label="26"] {
        background-color: v-bind("theme[26]");
      }
      &[aria-label="27"] {
        background-color: v-bind("theme[27]");
      }
      &[aria-label="28"] {
        background-color: v-bind("theme[28]");
      }
      &[aria-label="29"] {
        background-color: v-bind("theme[29]");
      }
      &[aria-label="30"] {
        background-color: v-bind("theme[30]");
      }
      &[aria-label="31"] {
        background-color: v-bind("theme[31]");
      }
    }
  }
}
</style>
