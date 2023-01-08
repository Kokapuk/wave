<template>
  <div :class="['tooltip', props.hide && 'hidden']">
    <slot />
    <span :class="['tooltip-text', props.positioning]">
      {{ props.text }}
      <div :class="['tooltip-arrow', props.positioning]"></div>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { TooltipPositioning } from '../../types';

interface IProps {
  text: string;
  positioning: TooltipPositioning;
  hide?: boolean;
}

const props = defineProps<IProps>();
</script>

<style scoped>
.tooltip {
  --tooltip__arrow-size: 8px;
  --tooltip__border-opacity: 0.1;
  --tooltip__border-width: 1px;
  --tooltip__move-animation-strength: 10px;

  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: top;
}

.tooltip-text {
  width: max-content;
  background-color: rgb(var(--light-gray));
  border: var(--tooltip__border-width) solid rgb(var(--font-color), var(--tooltip__border-opacity));
  color: rgb(var(--font-color));
  padding: 5px 10px;
  border-radius: var(--b-radius);
  position: absolute;
  z-index: 1;
  opacity: 0;
  pointer-events: none;
  font-size: 13px;
  transition: var(--transition);
}

.tooltip-text.top {
  bottom: calc(100% + var(--tooltip__arrow-size));
  transform: translateY(calc(var(--tooltip__move-animation-strength) * -1));
}

.tooltip-text.right {
  left: calc(100% + var(--tooltip__arrow-size));
  transform: translateX(calc(var(--tooltip__move-animation-strength)));
}

.tooltip-text.bottom {
  top: calc(100% + var(--tooltip__arrow-size));
  transform: translateY(calc(var(--tooltip__move-animation-strength)));
}

.tooltip-text.left {
  right: calc(100% + var(--tooltip__arrow-size));
  transform: translateX(calc(var(--tooltip__move-animation-strength) * -1));
}

.tooltip-arrow {
  content: '';
  z-index: -1;
  position: absolute;
  width: var(--tooltip__arrow-size);
  height: var(--tooltip__arrow-size);
  background-color: rgb(var(--light-gray));
  border-right: var(--tooltip__border-width) solid rgb(var(--font-color), var(--tooltip__border-opacity));
  border-bottom: var(--tooltip__border-width) solid rgb(var(--font-color), var(--tooltip__border-opacity));
}

.tooltip-arrow.top {
  left: calc(50% - (var(--tooltip__arrow-size) / 2));
  bottom: calc(-1 * (var(--tooltip__arrow-size) / 2) - 1px);
  rotate: 45deg;
}

.tooltip-arrow.right {
  left: calc(-1 * (var(--tooltip__arrow-size) / 2) - 1px);
  top: calc(50% - var(--tooltip__arrow-size) / 2);
  rotate: 135deg;
}

.tooltip-arrow.bottom {
  left: calc(50% - (var(--tooltip__arrow-size) / 2));
  top: calc(-1 * (var(--tooltip__arrow-size) / 2) - 1px);
  rotate: 225deg;
}

.tooltip-arrow.left {
  right: calc(-1 * (var(--tooltip__arrow-size) / 2) - 1px);
  top: calc(50% - var(--tooltip__arrow-size) / 2);
  rotate: -45deg;
}

.tooltip:hover:not(.hidden) .tooltip-text {
  opacity: 1;
  transform: translateX(0px);
  transform: translateY(0px);
}
</style>
