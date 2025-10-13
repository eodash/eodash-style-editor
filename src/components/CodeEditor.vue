<template>
  <div ref="containerRef" class="code-editor-container">
    <div v-if="isLoading" class="loader-overlay">
      <div class="loader large"></div>
    </div>
    <eox-jsonform
      :schema="editorSchema"
      :value="formValue"
      :style="{ visibility: isLoading ? 'hidden' : 'visible' }"
    ></eox-jsonform>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { debounce } from 'lodash'
import stringify from 'json-stringify-pretty-compact'
import { useExamples } from '../composables/useExamples.js'

const isDarkMode = ref(false)
const containerRef = ref(null)
const containerHeight = ref(0)
const isLoading = ref(true)
const activeFolds = ref(new Set())
let mediaQuery = null
let resizeObserver = null
let aceEditorInstance = null
let isUpdatingFromExternal = false
const { currentExampleStyle, updateCurrentStyle } = useExamples()

const updateDarkMode = (e) => {
  isDarkMode.value = e.matches
}

const updateContainerHeight = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
  }
}

// Debounced style update function (650ms delay)
const debouncedStyleUpdate = debounce((newStyle) => {
  updateCurrentStyle(newStyle)
}, 650)

const collapseAllExcept = (exemptRange) => {
  if (!aceEditorInstance) return

  const session = aceEditorInstance.getSession()
  const allFolds = session.getAllFolds()

  allFolds.forEach((fold) => {
    const foldKey = `${fold.start.row}-${fold.end.row}`
    if (exemptRange && exemptRange === foldKey) {
      return
    }

    if (activeFolds.value.has(foldKey)) {
      activeFolds.value.delete(foldKey)
    }
  })

  session.unfold()

  setTimeout(() => {
    initializeDefaultFolds()
    if (exemptRange) {
      const [startRow] = exemptRange.split('-').map(Number)
      const range = session.getFoldWidgetRange(startRow)
      if (range) {
        session.removeFold(session.getFoldAt(startRow))
        activeFolds.value.add(exemptRange)
      }
    }
  }, 10)
}

const initializeDefaultFolds = () => {
  if (!aceEditorInstance) return

  const session = aceEditorInstance.getSession()
  const lines = session.getLength()
  let braceDepth = 0

  for (let i = 0; i < lines; i++) {
    const line = session.getLine(i).trim()

    const openBraces = (line.match(/[{[]/g) || []).length
    const closeBraces = (line.match(/[}\]]/g) || []).length
    braceDepth += openBraces - closeBraces

    if (i === 0 || (i === 1 && session.getLine(0).trim() === '')) {
      continue
    }

    if (line.match(/^"[^"]+"\s*:\s*[{[]/) && braceDepth > 1) {
      const foldRange = session.getFoldWidgetRange(i)
      if (foldRange && foldRange.end.row > i + 1) {
        const foldKey = `${foldRange.start.row}-${foldRange.end.row}`
        if (!activeFolds.value.has(foldKey)) {
          session.addFold('...', foldRange)
        }
      }
    }
  }
}

const handleFoldChange = () => {
  if (!aceEditorInstance) return

  const session = aceEditorInstance.getSession()
  const allFolds = session.getAllFolds()
  const currentFoldKeys = new Set(allFolds.map((fold) => `${fold.start.row}-${fold.end.row}`))

  const previouslyActive = new Set(activeFolds.value)
  const newlyExpanded = [...previouslyActive].filter((key) => !currentFoldKeys.has(key))

  if (newlyExpanded.length > 0) {
    const expandedKey = newlyExpanded[0]

    setTimeout(() => {
      collapseAllExcept(expandedKey)
    }, 10)
  }
}

const setupAceEditor = async () => {
  // Wait for eox-jsonform to be fully initialized
  await nextTick()

  // Small delay to ensure the ACE editor is ready
  setTimeout(() => {
    try {
      const aceEditor =
        containerRef.value?.querySelector('eox-jsonform')?.editor?.editors?.['root.code']?.[
          'ace_editor_instance'
        ]

      if (aceEditor) {
        aceEditorInstance = aceEditor

        // Add direct change listener with debouncing
        aceEditor.on('change', handleDirectAceChange)

        // Add fold change listener for auto-collapse functionality
        aceEditor.getSession().on('changeFold', handleFoldChange)

        // Keep loader visible until folding is complete

        // Configure code folding and collapse JSON sections by default
        aceEditor.session.setFoldStyle('markbeginend')
        aceEditor.setOptions({
          foldStyle: 'markbeginend',
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
        })

        // Apply initial folding immediately
        activeFolds.value.clear()
        initializeDefaultFolds()
        isLoading.value = false
      } else {
        console.warn('Could not access ACE editor instance')
        isLoading.value = false
      }
    } catch (error) {
      console.warn('Error setting up direct ACE editor access:', error)
      isLoading.value = false
    }
  }, 100)
}

const handleDirectAceChange = () => {
  if (!aceEditorInstance || isUpdatingFromExternal) return

  try {
    const content = aceEditorInstance.getValue()
    const newStyle = JSON.parse(content)

    // Use debounced update to prevent excessive calls
    debouncedStyleUpdate(newStyle)
  } catch (error) {
    // Silently ignore JSON parse errors during editing
    // Only log if it's a different type of error
    if (!(error instanceof SyntaxError)) {
      console.warn('Error in ACE change handler:', error)
    }
  }
}

const cleanupAceEditor = () => {
  if (aceEditorInstance) {
    aceEditorInstance.off('change', handleDirectAceChange)
    aceEditorInstance.getSession().off('changeFold', handleFoldChange)
    aceEditorInstance = null
  }
  // Clear active folds state
  activeFolds.value.clear()
  // Cancel any pending debounced calls
  debouncedStyleUpdate.cancel()
}

const editorConfig = computed(() => {
  const fontSize = 15
  const lineHeight = Math.ceil(fontSize * 1.4)
  const padding = 20

  const availableHeight = containerHeight.value - padding
  const maxLines = Math.floor(availableHeight / lineHeight)

  return {
    tabSize: 2,
    fontSize,
    fontFamily: "'IBM Plex Mono', 'Consolas', 'Monaco', monospace",
    maxPixelHeight: Math.max(200, availableHeight),
    minLines: Math.max(10, maxLines),
    maxLines: Infinity,
    theme: isDarkMode.value ? 'ace/theme/monokai' : 'ace/theme/textmate',
    showFoldWidgets: true,
    foldStyle: 'markbeginend',
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
  }
})

// Watch for external style changes (e.g., from LayerControl)
watch(currentExampleStyle, (newStyle) => {
  if (aceEditorInstance && newStyle) {
    const currentContent = aceEditorInstance.getValue()
    const newContent = stringify(newStyle, { maxLength: 80 })

    // Only update if content actually changed to avoid unnecessary updates
    if (currentContent !== newContent) {
      isUpdatingFromExternal = true

      // Preserve cursor position
      const cursorPosition = aceEditorInstance.getCursorPosition()

      // Update the content
      aceEditorInstance.setValue(newContent, -1) // -1 preserves cursor position

      // Restore cursor position
      aceEditorInstance.moveCursorToPosition(cursorPosition)

      // Clear undo history to prevent confusion
      aceEditorInstance.getSession().getUndoManager().reset()

      // Re-apply default folds immediately after content update
      initializeDefaultFolds()

      // Re-enable internal updates after a brief delay
      setTimeout(() => {
        isUpdatingFromExternal = false
      }, 100)
    }
  }
})

onMounted(() => {
  if (window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    isDarkMode.value = mediaQuery.matches
    mediaQuery.addEventListener('change', updateDarkMode)
  }

  updateContainerHeight()

  if (containerRef.value && window.ResizeObserver) {
    resizeObserver = new ResizeObserver(() => {
      updateContainerHeight()
    })
    resizeObserver.observe(containerRef.value)
  }

  // Setup direct ACE editor access
  setupAceEditor()
})

onUnmounted(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', updateDarkMode)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }

  // Cleanup ACE editor
  cleanupAceEditor()
})

const formValue = computed(() => ({
  code: currentExampleStyle.value
    ? stringify(currentExampleStyle.value, { maxLength: 80 })
    : '// Select an example from the dropdown to view its style configuration\n// or write your own style here',
}))

const editorSchema = computed(() => ({
  type: 'object',
  properties: {
    code: {
      type: 'string',
      title: '',
      description: '',
      format: 'json',
      options: {
        ace: editorConfig.value,
      },
    },
  },
}))
</script>

<style scoped>
.code-editor-container {
  position: fixed;
  top: -40px;
  left: 0;
  width: calc(var(--sidebar-width, 300px) - 12px);
  height: calc(100vh + 40px);
}

.loader-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1000;
}

@media (prefers-color-scheme: dark) {
  .loader-overlay {
    background-color: rgba(30, 30, 30, 0.9);
  }
}
</style>

<style>
/* Global styles to hide the ACE editor label */
.code-editor-container .je-object__title {
  display: none !important;
}

.code-editor-container .je-object__container > .je-object__title {
  display: none !important;
}

.code-editor-container [data-schemapath='root.code'] > label {
  display: none !important;
}

/* Hide the "code" label specifically */
.code-editor-container .je-form-input-label:has(+ [data-schemapath='root.code']) {
  display: none !important;
}

.code-editor-container h3:has(+ div[data-schemapath='root.code']) {
  display: none !important;
}

/* Target the label that contains "code" text */
.code-editor-container label[for*='code'] {
  display: none !important;
}

/* Also hide any container that only contains the code label */
.code-editor-container .je-header {
  display: none !important;
}

/* No padding - toolbar overlays content */
</style>
