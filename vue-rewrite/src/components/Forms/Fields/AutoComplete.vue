<script lang="ts" setup>
import { ref } from "vue"

// Vue Definitions
const emits = defineEmits<{
  "update:value": [value: Record<string, unknown>]
}>()
const props = defineProps<{
  selectKey: string
  selectValue: string
  items: Record<string, unknown>[]
  label: string
}>()
const modelValue = defineModel<string>({ required: true })

// Variables
const menu2 = ref(false)
const filteredItems = ref<Record<string, unknown>[]>([])

// Functions
function filterItems(ev: string) {
  filteredItems.value = props.items.filter(item => {
    return (item[props.selectKey] as string).toLowerCase().includes(ev.toLowerCase())
  })
}

function menuCLick(ev: MouseEvent | KeyboardEvent) {
  // @ts-expect-error - exists
  const newValue = ev.target?.textContent as string
  modelValue.value = newValue
  const item = props.items.find(item => item[props.selectKey] === newValue)
  emits("update:value", item as Record<string, unknown>)
}
</script>

<template>
  <div>
    <v-menu v-model="menu2" location="bottom" transition="scale-transition">
      <template v-slot:activator="{ props }">
        <v-text-field
          v-bind="props"
          v-model="modelValue"
          :label="label"
          @update:focused="filterItems(modelValue)"
          @update:model-value="filterItems"
          hide-details
        />
      </template>
      <v-list>
        <v-list-item v-for="item in filteredItems" :key="(item[props.selectKey] as any)" @click="menuCLick">
          {{ item[props.selectValue] }}
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>
