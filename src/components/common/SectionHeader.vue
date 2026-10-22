<template>
  <div class="section-header">
    <div class="header-titles">
      <span v-if="eyebrow" class="header-eyebrow">{{ eyebrow }}</span>
      <h2 class="header-title">{{ title }}</h2>
      <p v-if="description" class="header-desc">{{ description }}</p>
    </div>

    <div v-if="$slots.action || linkTo" class="header-action">
      <slot name="action">
        <RouterLink v-if="linkTo" :to="linkTo" class="header-link">
          <span>{{ linkText || 'View All' }}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="link-arrow">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </RouterLink>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  eyebrow: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  linkTo: {
    type: [String, Object],
    default: null
  },
  linkText: {
    type: String,
    default: 'View All'
  }
})
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.header-eyebrow {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-gold);
}

.header-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

@media (max-width: 640px) {
  .header-title {
    font-size: 1.3rem;
  }
}

.header-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.header-action {
  flex-shrink: 0;
}

.header-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--transition-fast), transform var(--transition-fast);
}

.header-link:hover {
  color: var(--accent-gold);
  transform: translateX(2px);
}

.link-arrow {
  width: 14px;
  height: 14px;
}
</style>
