<template>
  <div class="track">
    <button class="track-image" :style="{ backgroundImage: `url(${props.image})` }"></button>
    <span class="track-name">{{ props.name }}</span>
  </div>
</template>

<script setup lang="ts">
interface IProps {
  image: string;
  name: string;
  author: string;
}

const props = defineProps<IProps>();
</script>

<style scoped>
.track {
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
}

.track-image {
  width: 230px;
  height: 230px;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: var(--b-radius-small);
  cursor: pointer;
}

.track-name {
  font-weight: 700;
  font-size: 13px;
}

.track-author {
}
</style>
