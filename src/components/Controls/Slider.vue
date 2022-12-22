<template>
  <div class="slider-container">
    <input :min="props.min" :max="props.max" v-bind="$attrs" @input="inputHandle" :value="value" class="slider" type="range" />
    <div
      :style="{
        width: `calc(${(value - props.min) * (100 / (props.max - props.min))}% + ${
          (6 / 100) * (100 - (value - props.min) * (100 / (props.max - props.min)))
        }px`,
      }"
      :class="['slider-fill', (attrs.disabled === '' || attrs.disabled === 'true') && 'disabled']"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, useAttrs } from 'vue';

interface IProps {
  modelValue: number;
  min: number;
  max: number;
}

const emit = defineEmits(['update:modelValue']);
const props = defineProps<IProps>();
const value = ref(props.modelValue);
const attrs = useAttrs();

function inputHandle(event: Event) {
  value.value = (event.target as HTMLInputElement).valueAsNumber;
  emit('update:modelValue', value.value);
}
</script>

<style scoped>
.slider-container {
  width: 100%;
  height: 12px;
  border-radius: 3px;
  background-color: transparent;
  position: relative;
}

.slider {
  appearance: none;
  position: absolute;
  top: calc(50% + 3px);
  width: 100%;
  height: 6px;
  background-color: rgb(var(--light-gray));
  border-radius: 3px;
  cursor: pointer;
  margin-top: -6px;
}

.slider:disabled {
  cursor: not-allowed;
}

.slider-fill.disabled {
  opacity: 0.5;
}

.slider::-webkit-slider-thumb {
  z-index: 50;
  appearance: none;
  background-color: white;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  position: relative;
}

.slider:disabled::-webkit-slider-thumb {
  opacity: 0.5;
}

.slider-fill {
  pointer-events: none;
  position: absolute;
  top: 3px;
  height: 6px;
  background-color: rgb(var(--accent));
  border-radius: 3px;
}
</style>
