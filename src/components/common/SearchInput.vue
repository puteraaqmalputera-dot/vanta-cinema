<template>
  <div class="search-input-wrapper" :class="{ 'is-focused': isFocused, 'has-value': !!modelValue }">
    <div class="search-icon-wrap" aria-hidden="true">
      <svg v-if="!isLoading" class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <div v-else class="search-spinner" />
    </div>

    <input
      ref="inputRef"
      type="search"
      class="search-input"
      :value="modelValue"
      :placeholder="placeholder"
      :aria-label="ariaLabel || placeholder"
      autocomplete="off"
      spellcheck="false"
      @input="handleInput"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keydown.esc="clearSearch"
    />

    <button
      v-if="modelValue"
      type="button"
      class="clear-btn"
      aria-label="Clear search query"
      @click="clearSearch"
    >
      <svg class="clear-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search titles, genres, or keywords...'
  },
  ariaLabel: {
    type: String,
    default: 'Search'
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'clear'])

const inputRef = ref(null)
const isFocused = ref(false)

function handleInput(event) {
  emit('update:modelValue', event.target.value)
}

function clearSearch() {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}
</script>

<style scoped>
.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  background-color: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.search-input-wrapper:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.search-input-wrapper.is-focused {
  border-color: var(--accent-gold);
  background-color: var(--bg-elevated);
  box-shadow: 0 0 0 3px var(--accent-gold-muted);
}

.search-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: var(--space-md);
  color: var(--text-muted);
}

.search-icon {
  width: 18px;
  height: 18px;
}

.search-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-top-color: var(--accent-gold);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.search-input {
  width: 100%;
  padding: 12px var(--space-md);
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

/* Remove default webkit search cancel button */
.search-input::-webkit-search-cancel-button {
  display: none;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-right: var(--space-sm);
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  transition: color var(--transition-fast);
}

.clear-btn:hover {
  color: var(--text-primary);
}

.clear-icon {
  width: 16px;
  height: 16px;
}
</style>
