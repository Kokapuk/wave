<template>
  <div class="progress-bg">
    <div class="progress-fill" :style="{ width: Math.round(props.progress) + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  progress: number;
}

const props = defineProps<IProps>();
</script>

<style scoped>
.progress-bg {
  height: 10px;
  width: 100%;
  border-radius: 15px;
  background-color: rgb(var(--light-gray));
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: rgb(var(--accent));
  border-radius: 15px;
  transition: var(--transition);
}
</style>
