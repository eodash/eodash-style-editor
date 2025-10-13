import './assets/main.css'
import '@eox/ui/style.css'

import { createApp } from 'vue'
import App from './App.vue'

// Try to register FlatGeoBuf format support
try {
  // Import FlatGeoBuf if available
  import('flatgeobuf/lib/mjs/ol')
    .then(() => {
      // FlatGeoBuf OpenLayers integration loaded successfully
    })
    .catch((error) => {
      console.warn('Could not load FlatGeoBuf OpenLayers integration:', error)
    })
} catch (error) {
  console.warn('FlatGeoBuf import failed:', error)
}

createApp(App).mount('#app')
