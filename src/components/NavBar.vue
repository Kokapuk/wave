<template>
  <div class="navigation-bar">
    <div class="logo-container">
      <Logo class="logo" />
      <span class="logo-text">Wave</span>
    </div>
    <div class="links">
      <RouterLink :class="['nav-link', playerStore.isNavBarDisabled && 'disabled']" to="/">
        <Squares class="nav-link-icon" /> Your Library
      </RouterLink>
      <RouterLink :class="['nav-link', playerStore.isNavBarDisabled && 'disabled']" to="/settings">
        <Gear class="nav-link-icon" /> Settings
      </RouterLink>
      <RouterLink :class="['nav-link', playerStore.isNavBarDisabled && 'disabled']" to="/add/mp3">
        <Plus class="nav-link-icon" /> Add MP3
      </RouterLink>
      <RouterLink :class="['nav-link', playerStore.isNavBarDisabled && 'disabled']" to="/add/spotify">
        <Spotify class="nav-link-icon" /> Add from Spotify
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from './Icons/Logo.vue';
import Plus from './Icons/Plus.vue';
import Gear from './Icons/Gear.vue';
import Squares from './Icons/Squares.vue';
import Spotify from './Icons/Spotify.vue';
import { usePlayerStore } from '@/stores/player';

const playerStore = usePlayerStore();
</script>

<style scoped>
.navigation-bar {
  display: flex;
  height: 100%;
  width: 275px;
  background-color: rgb(var(--bg-light));
  padding: 26px 8px;
  flex-direction: column;
  gap: 21px;
  border-right: var(--b-seperator);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 18px;
}

.logo {
  fill: rgb(var(--accent));
  height: 44px;
}

.logo-text {
  color: rgb(var(--accent));
  font-weight: 700;
  font-size: 31px;
}

.links {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.nav-link {
  display: flex;
  padding: 11px 18px;
  width: 100%;
  border-radius: var(--b-radius);
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  color: rgb(var(--accent));
  align-items: center;
  gap: 13px;
  transition: var(--transition);
}

.nav-link:hover {
  background-color: #39393b;
}

.nav-link.router-link-active {
  background-color: #39393b;
}

.nav-link.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.nav-link-icon {
  height: 18px;
  fill: rgb(var(--accent));
}
</style>
