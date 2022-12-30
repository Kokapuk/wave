<template>
  <div :class="['modal-bg', props.show && 'show']">
    <div :class="['modal-content', props.show && 'show']">
      <h2 class="modal-title">{{ props.title }}</h2>
      <div class="separator"></div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  title: string;
  show: boolean;
}

const props = defineProps<IProps>();
</script>

<style scoped>
.modal-bg {
  z-index: 100;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
  transition: var(--transition);
}

.modal-bg.show {
  opacity: 1;
  pointer-events: all;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px 25px;
  min-width: 250px;
  max-width: 450px;
  background-color: rgb(var(--bg));
  border-radius: var(--b-radius);
  scale: 0.85;
  transition: var(--transition);
}

.modal-content.show {
  scale: 1;
}
</style>
