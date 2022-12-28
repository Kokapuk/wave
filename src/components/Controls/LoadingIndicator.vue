<template>
  <div class="loading-indicator">
    <div class="loading-indicator__circle top"></div>
    <div class="loading-indicator__circle left"></div>
    <div class="loading-indicator__circle right"></div>
  </div>
</template>

<style scoped>
.loading-indicator {
  --spin-time: 1s;
  --spin-part-multiplier: 1;
  --loading-indicator-size: 100px;
  --loading-indicator-width: 12; /*percent of size, NOT PX*/
  --loading-indicator-color: rgb(var(--accent));
}

.loading-indicator {
  position: relative;
  height: var(--loading-indicator-size);
  aspect-ratio: 1/1;
  animation: spin var(--spin-time) linear infinite;
}

.loading-indicator__circle {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: calc(var(--loading-indicator-size) / 100 * var(--loading-indicator-width)) solid transparent;
  border-radius: 50%;
}

.loading-indicator__circle.top {
  border-top-color: var(--loading-indicator-color);
}

.loading-indicator__circle.left {
  border-left-color: var(--loading-indicator-color);
  animation: spin-left-part calc(var(--spin-time) * var(--spin-part-multiplier)) infinite alternate;
}

.loading-indicator__circle.right {
  border-right-color: var(--loading-indicator-color);
  animation: spin-right-part calc(var(--spin-time) * var(--spin-part-multiplier)) infinite alternate;
}

@keyframes spin {
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
}

@keyframes spin-left-part {
  from {
    rotate: 90deg;
  }
  to {
    rotate: 0deg;
  }
}

@keyframes spin-right-part {
  from {
    rotate: -90deg;
  }
  to {
    rotate: 0deg;
  }
}
</style>
