<template>
  <button
    type="button"
    class="mood-card"
    :class="{ 'is-selected': isSelected }"
    :aria-pressed="isSelected"
    @click="$emit('select', mood)"
  >
    <div class="mood-header">
      <div class="mood-icon-wrap" :style="{ color: mood.color }">
        <component :is="mood.iconComponent" class="mood-icon" />
      </div>
      <div v-if="isSelected" class="selected-indicator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="check-icon">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    </div>

    <div class="mood-body">
      <h3 class="mood-name">{{ mood.name }}</h3>
      <p class="mood-description">{{ mood.description }}</p>
      <div class="mood-tagline">{{ mood.tagline }}</div>
    </div>
  </button>
</template>

<script setup>
defineProps({
  mood: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

defineEmits(['select'])
</script>

<style scoped>
.mood-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: var(--space-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  cursor: pointer;
  width: 100%;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.mood-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: transparent;
  transition: background-color var(--transition-fast);
}

.mood-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.mood-card.is-selected {
  background: rgba(28, 28, 35, 0.95);
  border-color: var(--accent-gold);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--accent-gold);
}

.mood-card.is-selected::before {
  background: var(--accent-gold);
}

.mood-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: var(--space-md);
}

.mood-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-subtle);
}

.mood-icon {
  width: 22px;
  height: 22px;
}

.selected-indicator {
  width: 24px;
  height: 24px;
  border-radius: var(--radius-pill);
  background: var(--accent-gold);
  color: var(--bg-base);
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  width: 14px;
  height: 14px;
}

.mood-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mood-name {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
}

.mood-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.mood-tagline {
  font-size: 0.75rem;
  color: var(--accent-gold);
  font-weight: 500;
  margin-top: var(--space-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
</style>
