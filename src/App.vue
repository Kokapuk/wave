<template>
  <div class="wrapper">
    <main>
      <NavigationBar />
      <header class="title">{{ usePlayerStore().title }}</header>
      <div></div>
    </main>
    <Player />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { usePlayerStore } from './stores/player';
import Player from './components/Player.vue';
import NavigationBar from './components/NavigationBar.vue';
</script>

<style scoped>
.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
}

main {
  display: flex;
  height: 100%;
  background-color: rgb(var(--bg));
}

.title {
  width: 100%;
  padding: 21px 41px;
  font-weight: 700;
  font-size: 33px;
  height: min-content;
  border-bottom: var(--b-seperator);
  user-select: none;
  -webkit-app-region: drag;
}
</style>
