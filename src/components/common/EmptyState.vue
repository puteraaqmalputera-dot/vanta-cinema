<template>
  <div class="empty-state-container">
    <div class="empty-icon-box">
      <slot name="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </slot>
    </div>

    <h3 class="empty-title">{{ title }}</h3>
    <p class="empty-message">{{ message }}</p>

    <div v-if="$slots.action || actionText" class="empty-action">
      <slot name="action">
        <RouterLink v-if="actionTo" :to="actionTo" class="btn btn-primary">
          {{ actionText }}
        </RouterLink>
        <button v-else-if="actionText" type="button" class="btn btn-primary" @click="$emit('action')">
          {{ actionText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'No Items Found'
  },
  message: {
    type: String,
    default: 'Try adjusting your search query, mood, or filter parameters.'
  },
  actionText: {
    type: String,
    default: ''
  },
  actionTo: {
    type: [String, Object],
    default: null
  }
})

defineEmits(['action'])
</script>

<style scoped>
.empty-state-container {
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

.empty-icon-box {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.04);
  color: var(--accent-gold);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--space-md);
  border: 1px solid var(--border-subtle);
}

.empty-icon {
  width: 26px;
  height: 26px;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-xs);
}

.empty-message {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: var(--space-lg);
}

.empty-action {
  display: flex;
  align-items: center;
}
</style>
