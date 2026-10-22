<template>
  <span 
    class="genre-pill" 
    :class="{ 'pill-clickable': clickable, 'pill-active': active, [`pill-${size}`]: true }"
    @click="handleClick"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    @keydown.enter="handleClick"
    @keydown.space.prevent="handleClick"
  >
    <slot>{{ name }}</slot>
  </span>
</template>

<script setup>
const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  clickable: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'sm', // 'xs', 'sm', 'md'
    validator: (v) => ['xs', 'sm', 'md'].includes(v)
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  if (props.clickable) {
    emit('click')
  }
}
</script>

<style scoped>
.genre-pill {
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-medium);
  color: var(--text-secondary);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0.01em;
  transition: all var(--transition-fast);
  user-select: none;
}

.pill-xs {
  padding: 3px 8px;
  font-size: 0.7rem;
}

.pill-sm {
  padding: 5px 12px;
  font-size: 0.8rem;
}

.pill-md {
  padding: 8px 16px;
  font-size: 0.875rem;
}

.pill-clickable {
  cursor: pointer;
}

.pill-clickable:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.2);
}

.pill-active {
  background-color: var(--accent-gold-muted);
  border-color: var(--accent-gold);
  color: var(--accent-gold);
}

.pill-clickable:focus-visible {
  outline: 2px solid var(--accent-gold);
  outline-offset: 2px;
}
</style>
