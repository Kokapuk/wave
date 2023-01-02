<template>
  <button
    @mousedown="(event) => !props.noRipples && initiateRipple(event.offsetX, event.offsetY)"
    :disabled="props.loading ? props.loading : false"
    class="button">
    <div
      v-if="!props.noRipples"
      v-for="ripple in ripples"
      class="ripple"
      :style="{ left: ripple.x - 5 + 'px', top: ripple.y - 5 + 'px' }"></div>
    <Transition name="fade">
      <div v-if="props.loading" class="loading-container">
        <LoadingIndicator />
      </div>
    </Transition>
    <slot class="me-5" />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import LoadingIndicator from './LoadingIndicator.vue';

interface IRipple {
  x: number;
  y: number;
  id: number;
}

interface IProps {
  loading?: boolean;
  noRipples?: boolean;
}

const props = defineProps<IProps>();
const ripples = ref<IRipple[]>([]);
const rippleTimeout = ref<null | NodeJS.Timeout>(null);

function initiateRipple(x: number, y: number) {
  let newRipple: IRipple = { x, y, id: Date.now() * Math.random() };

  ripples.value.push(newRipple);

  if (rippleTimeout.value !== null) clearTimeout(rippleTimeout.value);

  rippleTimeout.value = setTimeout(() => {
    ripples.value = [];
  }, 400);
}
</script>

<style scoped>
.button {
  display: inline-flex;
  justify-content: center;
  vertical-align: top;
  background-color: rgb(var(--accent));
  padding: 10px 15px;
  color: white;
  border-radius: var(--b-radius);
  font-size: 17px;
  border: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  white-space: pre;
  height: min-content;
}

.button:disabled {
  color: rgb(var(--font-color-dark));
  cursor: not-allowed;
}

.button:not(:disabled)::after {
  content: '';
  position: absolute;
  background-color: rgb(var(--font-color));
  opacity: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: var(--transition);
}

.button:hover::after {
  opacity: 0.1;
}

.button:active::after {
  opacity: 0.2;
}

.loading-container {
  display: flex;
  position: absolute;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: inherit;
}

.loading-indicator {
  --loading-indicator-size: 30px !important;
  --loading-indicator-color: white !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: var(--transition);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.ripple {
  position: absolute;
  aspect-ratio: 1/1;
  transform-origin: 50% 50%;
  width: 10px;
  border-radius: 50%;
  background-color: rgb(var(--font-color), 0.3);
  animation: scale 400ms linear forwards;
  pointer-events: none;
}

@keyframes scale {
  to {
    scale: 15;
    opacity: 0;
  }
}

.icon-button {
  padding: 10px;
}
</style>

<style>
.icon-button__icon {
  height: 20px;
}
</style>
