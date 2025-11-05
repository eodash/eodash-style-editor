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
    <div class="editor-toolbar">
      <button class="small" @click="handleFormat">Format</button>
      <button class="small" @click="handleFold">Fold</button>
    </div>
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

const handleFormat = () => {
  if (!aceEditorInstance) return

  try {
    const content = aceEditorInstance.getValue()
    const parsed = JSON.parse(content)
    const formatted = stringify(parsed, { maxLength: 80 })

    // Preserve cursor and scroll position
    const cursorPosition = aceEditorInstance.getCursorPosition()
    const scrollTop = aceEditorInstance.getSession().getScrollTop()

    aceEditorInstance.setValue(formatted, -1)
    aceEditorInstance.moveCursorToPosition(cursorPosition)
    aceEditorInstance.getSession().setScrollTop(scrollTop)

    // Re-apply default folds
    initializeDefaultFolds()
  } catch (error) {
    // Silently ignore if JSON is invalid
    console.warn('Cannot format invalid JSON')
  }
}

const handleFold = () => {
  if (!aceEditorInstance) return

  // Clear existing folds and re-apply default folding
  const session = aceEditorInstance.getSession()
  session.unfold()
  activeFolds.value.clear()
  initializeDefaultFolds()
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

        // Keep loader visible until folding is complete

        // Configure code folding and collapse JSON sections by default
        aceEditor.session.setFoldStyle('markbeginend')
        aceEditor.setOptions({
          foldStyle: 'markbeginend',
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          behavioursEnabled: false, // Disable smart behaviors that auto-format spacing
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
  if (!aceEditorInstance) {
    console.log('[CodeEditor] handleDirectAceChange: no aceEditorInstance')
    return
  }

  if (isUpdatingFromExternal) {
    console.log('[CodeEditor] handleDirectAceChange: skipping (isUpdatingFromExternal=true)')
    return
  }

  try {
    const content = aceEditorInstance.getValue()
    const newStyle = JSON.parse(content)
    console.log('[CodeEditor] handleDirectAceChange: parsed style:', newStyle)
    console.log('[CodeEditor] handleDirectAceChange: has variables?', newStyle.variables)
    console.log('[CodeEditor] handleDirectAceChange: stroke-width value:', newStyle['stroke-width'])

    // Use debounced update to prevent excessive calls
    debouncedStyleUpdate(newStyle)
  } catch (error) {
    // Cancel any pending debounced updates when JSON is invalid
    // This prevents old valid states from overwriting current editing
    debouncedStyleUpdate.cancel()

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
    behavioursEnabled: false, // Disable smart behaviors that auto-format spacing
  }
})

// Watch for external style changes (e.g., from LayerControl)
watch(currentExampleStyle, (newStyle) => {
  console.log('[CodeEditor] watch currentExampleStyle triggered with:', newStyle)
  console.log('[CodeEditor] watch: has variables?', newStyle?.variables)
  console.log('[CodeEditor] watch: stroke-width value:', newStyle?.['stroke-width'])

  if (!aceEditorInstance || !newStyle) {
    return
  }

  // Don't update if user is actively editing - user edits have absolute priority
  if (aceEditorInstance.isFocused()) {
    console.log('[CodeEditor] watch: editor is focused, skipping update to prevent overwriting user input')
    return
  }

  const currentContent = aceEditorInstance.getValue()
  const newContent = stringify(newStyle, { maxLength: 80 })

  console.log('[CodeEditor] watch: newContent:', newContent)

  // Only update if content actually changed to avoid unnecessary updates
  if (currentContent !== newContent) {
    console.log('[CodeEditor] watch: content changed, updating ACE editor')
    isUpdatingFromExternal = true

    // Preserve cursor position and selection
    const cursorPosition = aceEditorInstance.getCursorPosition()
    const scrollTop = aceEditorInstance.getSession().getScrollTop()

    // Update the content
    aceEditorInstance.setValue(newContent, -1) // -1 moves cursor to start

    // Restore cursor position and scroll
    aceEditorInstance.moveCursorToPosition(cursorPosition)
    aceEditorInstance.getSession().setScrollTop(scrollTop)

    // Clear undo history to prevent confusion
    aceEditorInstance.getSession().getUndoManager().reset()

    // Re-apply default folds immediately after content update
    initializeDefaultFolds()

    // Re-enable internal updates after a brief delay
    setTimeout(() => {
      console.log('[CodeEditor] watch: re-enabling internal updates')
      isUpdatingFromExternal = false
    }, 100)
  } else {
    console.log('[CodeEditor] watch: content unchanged, skipping update')
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
  top: 0; /* -40px for top */
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

.editor-toolbar {
  position: fixed;
  left: 0;
  top: 0;
  height: 40px;
  width: calc(var(--sidebar-width, 300px) - 12px);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
  gap: 8px;
  background: white;
  z-index: 1000;
}

@media (prefers-color-scheme: dark) {
  .editor-toolbar {
    background: #1e1e1e;
  }
}
</style>
