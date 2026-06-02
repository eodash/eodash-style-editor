<template>
  <div class="map-buttons">
    <button
      class="small map-button"
      @click="toggleLayerControl"
      :title="isLayerControlVisible ? 'Hide Layers' : 'Show Layers'"
    >
      <svg v-if="isLayerControlVisible" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>layers</title>
        <path
          d="M12,16L19.36,10.27L21,9L12,2L3,9L4.63,10.27M12,18.54L4.62,12.81L3,14.07L12,21.07L21,14.07L19.37,12.8L12,18.54Z"
        />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <title>layers-off</title>
        <path
          d="M3.27,1L2,2.27L6.22,6.5L3,9L4.63,10.27L12,16L14.1,14.37L15.53,15.8L12,18.54L4.63,12.81L3,14.07L12,21.07L16.95,17.22L20.73,21L22,19.73L3.27,1M19.36,10.27L21,9L12,2L9.09,4.27L16.96,12.15L19.36,10.27M19.81,15L21,14.07L19.57,12.64L18.38,13.56L19.81,15Z"
        />
      </svg>
    </button>

    <!-- Future map buttons can be added here -->
  </div>
</template>

<script setup>
import { useLayerControl } from '../composables/useLayerControl.js'

// Layer control functionality
const { isLayerControlVisible, toggleLayerControl } = useLayerControl()
</script>

<style scoped>
/* This import is necessary for any components that utilize EOxUI */
@import url('@eox/ui/style.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.map-buttons {
  position: fixed;
  top: 70px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1800;
}

.map-button {
  max-height: 32px;
  height: 32px;
  max-width: 32px;
  width: 32px;
  padding: 0;
  margin: 0;
}

/* Button transparency and blur styling */
/*.map-button {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  width: 40px;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-button:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}*/

@media (prefers-color-scheme: dark) {
  .map-button {
    background: rgba(30, 30, 30, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .map-button:hover {
    background: rgba(45, 45, 45, 0.9);
  }
}

/* MDI Icon styling */
.mdi-icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  vertical-align: middle;
}
</style>
