<template>
  <div class="not-found-view container">
    <div class="not-found-card">
      <div class="error-badge">404 &bull; Missing Reel</div>
      <h1 class="not-found-title">Lost in the Projection Booth</h1>
      <p class="not-found-desc">
        The cinematic sequence you are seeking does not exist or has been shifted in our distribution catalog.
      </p>

      <div class="actions-row">
        <RouterLink to="/" class="btn btn-primary">
          Return to Discover
        </RouterLink>
        <RouterLink to="/movies" class="btn btn-secondary">
          Browse Movie Catalog
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  min-height: 75vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4xl) var(--space-md);
}

.not-found-card {
  max-width: 540px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-3xl) var(--space-xl);
  background: var(--bg-card);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-xl);
}

.error-badge {
  padding: 4px 12px;
  background: var(--accent-gold-muted);
  border: 1px solid var(--accent-gold);
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.not-found-title {
  font-family: var(--font-display);
  font-size: 2.2rem;
  color: var(--text-primary);
}

.not-found-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.actions-row {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
  flex-wrap: wrap;
  justify-content: center;
}
</style>
