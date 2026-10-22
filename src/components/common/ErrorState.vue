<template>
  <div class="error-state-container" role="alert">
    <div class="error-icon-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="error-icon">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>

    <h3 class="error-title">{{ title }}</h3>
    <p class="error-message">{{ message }}</p>

    <div v-if="details" class="error-details">
      <code>{{ details }}</code>
    </div>

    <div class="error-actions">
      <button 
        v-if="canRetry" 
        type="button" 
        class="btn btn-outline-gold"
        @click="$emit('retry')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="btn-icon">
          <polyline points="1 4 1 10 7 10" />
          <polyline points="23 20 23 14 17 14" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        </svg>
        <span>{{ retryText }}</span>
      </button>

      <slot name="extra-actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Unable to Load Content'
  },
  message: {
    type: String,
    default: 'An unexpected issue occurred while fetching data from the service.'
  },
  details: {
    type: String,
    default: ''
  },
  canRetry: {
    type: Boolean,
    default: true
  },
  retryText: {
    type: String,
    default: 'Try Again'
  }
})

defineEmits(['retry'])
</script>

<style scoped>
.error-state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-3xl) var(--space-lg);
  max-width: 520px;
  margin: var(--space-xl) auto;
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-xl);
}

.error-icon-box {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-pill);
  background: var(--color-danger-bg);
  color: var(--color-danger);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-md);
  border: 1px solid rgba(224, 82, 82, 0.25);
}

.error-icon {
  width: 28px;
  height: 28px;
}

.error-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.error-message {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-md);
}

.error-details {
  background: rgba(0, 0, 0, 0.4);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
  max-width: 100%;
  overflow-x: auto;
}

.error-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.btn-icon {
  width: 16px;
  height: 16px;
}
</style>
