import { ref } from 'vue'

const isMapLoading = ref(false)
const loadingHint = ref('')

const loadingHints = [
  'Calculating orbital trajectories ...',
  'Optimizing delta-v requirements ...',
  'Pointing correct end towards sky ...',
  'Combobulating discombobulators ...',
  'Treating Kessler syndrome ...',
  'Calling orbital mechanic ...',
  'Cleaning transfer windows ...',
  'Counting geigers ...',
  'Coupling decouplers ...',
  'Negotiating gravity ...',
  'Settling argument of periapsis ...',
]

const getRandomHint = () => {
  return loadingHints[Math.floor(Math.random() * loadingHints.length)]
}

export function useLoading() {
  const startMapLoading = () => {
    isMapLoading.value = true
    loadingHint.value = getRandomHint()
  }

  const stopMapLoading = () => {
    isMapLoading.value = false
    loadingHint.value = ''
  }

  return {
    isMapLoading,
    loadingHint,
    startMapLoading,
    stopMapLoading,
  }
}
