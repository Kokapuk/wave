<template>
  <div
    @blur="() => emit('close')"
    ref="menuContainer"
    tabindex="0"
    :class="['menu-container', { shown: props.show }]"
    :style="{ left: clampHorizontal(props.offsetX) + 'px', top: clampVertical(props.offsetY) + 'px' }">
    <Button
      v-for="item in props.menuItems"
      @click="(event) => menuItemClickHandle(event, item)"
      :disabled="item.disabled"
      :class="['menu-item icon-button', item.separator && 'separator', item.danger && 'danger']">
      <Component class="icon-button__icon" v-if="item.icon !== undefined" :is="item.icon" />
      {{ item.text }}
    </Button>
  </div>
</template>

<script setup lang="ts">
export interface IMenuItem {
  text: string;
  disabled?: boolean;
  icon?: Component;
  separator?: boolean;
  danger?: boolean;
  clickHandle?: (event: MouseEvent) => void;
}

import { ref, watch, type Component } from 'vue';
import Button from './Button.vue';

interface IProps {
  show: boolean;
  offsetX: number;
  offsetY: number;
  menuItems: IMenuItem[];
}

const props = defineProps<IProps>();
const emit = defineEmits(['close']);
const menuContainer = ref<null | HTMLDivElement>(null);

watch(
  () => props.show,
  () => {
    if (props.show) menuContainer.value!.focus();
  }
);

function clampHorizontal(x: number): number {
  if (menuContainer.value === null) return 0;

  if (x + menuContainer.value.clientWidth > window.innerWidth) {
    return window.innerWidth - menuContainer.value!.clientWidth;
  }

  return x;
}

function clampVertical(y: number) {
  if (menuContainer.value === null) return 0;

  if (y + menuContainer.value.clientHeight > window.innerHeight) {
    return window.innerHeight - menuContainer.value!.clientHeight;
  }

  return y;
}

function menuItemClickHandle(event: MouseEvent, item: IMenuItem) {
  item.clickHandle && item.clickHandle(event);
  menuContainer.value!.focus();
  menuContainer.value!.blur();
  emit('close');
}
</script>

<style scoped>
.menu-container {
  z-index: 5;
  pointer-events: none;
  position: fixed;
  background-color: rgb(var(--light-gray));
  width: min-content;
  border-radius: var(--b-radius);
  border: 1px solid rgb(var(--font-color), 0.1);
  overflow: hidden;
  opacity: 0;
  transition: var(--transition);
  transition-property: opacity;
}

.menu-container:focus-within {
  pointer-events: all;
  opacity: 1;
}

.menu-item {
  width: 100%;
  justify-content: left;
  color: rgb(var(--font-color));
  background-color: transparent;
  border-radius: 0;
}

.menu-item.separator {
  border-bottom: 1px solid rgb(var(--font-color), 0.1);
}

.menu-item.danger {
  --font-color: 220, 20, 60;
}
</style>
