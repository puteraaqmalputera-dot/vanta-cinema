<template>
  <article class="university-card">
    <div class="card-header">
      <div class="country-badge">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="globe-icon">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span>{{ university.country }}</span>
      </div>

      <span v-if="university.state" class="state-tag">{{ university.state }}</span>
    </div>

    <div class="card-body">
      <h3 class="uni-name" :title="university.name">{{ university.name }}</h3>
      <p v-if="university.domain" class="uni-domain">
        <span>Domain:</span> <code>{{ university.domain }}</code>
      </p>
    </div>

    <div class="card-footer">
      <a 
        v-if="university.website"
        :href="university.website" 
        target="_blank" 
        rel="noopener noreferrer"
        class="uni-link"
        :aria-label="`Visit official website of ${university.name}`"
      >
        <span>Official Website</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="link-icon">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
      <span v-else class="no-link">No website listed</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  university: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.university-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--space-lg);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
  position: relative;
  min-height: 180px;
}

.university-card:hover {
  background: var(--bg-card-hover);
  border-color: rgba(214, 181, 122, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
  flex-wrap: wrap;
}

.country-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--accent-gold);
  background: var(--accent-gold-muted);
  border: 1px solid var(--accent-gold-border);
  padding: 2px 8px;
  border-radius: var(--radius-pill);
}

.globe-icon {
  width: 12px;
  height: 12px;
}

.state-tag {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.uni-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.35;
}

.uni-domain {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.uni-domain code {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  padding: 1px 4px;
  border-radius: 3px;
}

.card-footer {
  margin-top: var(--space-md);
  padding-top: var(--space-xs);
  border-top: 1px solid var(--border-subtle);
}

.uni-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--accent-gold);
  transition: all var(--transition-fast);
}

.uni-link:hover {
  color: #FFF;
  text-decoration: underline;
}

.link-icon {
  width: 14px;
  height: 14px;
}

.no-link {
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
