<template>
  <footer class="app-footer">
    <div class="footer-container container">
      <!-- Top Row: Brand & Links -->
      <div class="footer-main">
        <div class="footer-brand-col">
          <RouterLink to="/" class="footer-brand">
            <span class="brand-text">VANTA</span>
            <span class="brand-sub">CINEMA</span>
          </RouterLink>
          <p class="footer-tagline">Every story starts with discovery.</p>
          <p class="footer-purpose">
            A premium cinematic exploration platform designed for movie lovers, series enthusiasts, and digital storytellers.
          </p>
        </div>

        <div class="footer-nav-col">
          <h4 class="col-title">Discovery</h4>
          <ul class="col-links">
            <li><RouterLink to="/">Featured Cinema</RouterLink></li>
            <li><RouterLink to="/movies">Movie Explorer</RouterLink></li>
            <li><RouterLink to="/tv">TV Series Explorer</RouterLink></li>
            <li><RouterLink to="/mood-match">Mood Match Engine</RouterLink></li>
            <li><RouterLink to="/universities">University Directory</RouterLink></li>
            <li><RouterLink to="/watchlist">Personal Watchlist</RouterLink></li>
          </ul>
        </div>

        <div class="footer-attribution-col">
          <h4 class="col-title">3 Integrated Third-Party APIs</h4>
          <div class="api-notice-block">
            <p class="api-notice">
              <strong>1. The Movie Database (TMDB) [Unique API]:</strong> Movie metadata, posters, backdrops, and trailer links are sourced via TMDB REST API.
            </p>
            <p class="api-notice">
              <strong>2. TVmaze [Shared API 2]:</strong> Television series information, episode listings, and live broadcast schedules are powered by the open TVmaze API.
            </p>
            <p class="api-notice">
              <strong>3. Hipo Universities API [Shared API 3]:</strong> Higher education institutions and film academies directory providing university name, country, and website links.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Row: Copyright & Legal Notice -->
      <div class="footer-bottom">
        <p class="copyright-text">
          &copy; {{ currentYear }} VANTA CINEMA &bull; TVETMARA Besut Front-End Programming Final Project (DFV 10023).
        </p>
        <p class="disclaimer-text">
          Educational project only. Does not host, stream, or distribute copyrighted video media.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.app-footer {
  background: #0B0B0E;
  border-top: 1px solid var(--border-medium);
  padding: var(--space-3xl) 0 var(--space-xl);
  margin-top: var(--space-4xl);
}

.footer-main {
  display: grid;
  grid-template-columns: 2fr 1fr 2fr;
  gap: var(--space-2xl);
  padding-bottom: var(--space-2xl);
  border-bottom: 1px solid var(--border-subtle);
}

.footer-brand {
  display: flex;
  align-items: baseline;
  gap: 6px;
  text-decoration: none;
}

.brand-text {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  color: var(--text-primary);
}

.brand-sub {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--accent-gold);
}

.footer-tagline {
  font-size: 0.95rem;
  font-style: italic;
  color: var(--text-secondary);
  margin: var(--space-xs) 0;
}

.footer-purpose {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 380px;
}

.col-title {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent-gold);
  margin-bottom: var(--space-md);
}

.col-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.col-links a {
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: color var(--transition-fast);
}

.col-links a:hover {
  color: var(--text-primary);
}

.api-notice-block {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.api-notice {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.api-notice strong {
  color: var(--text-secondary);
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: var(--space-lg);
  font-size: 0.78rem;
  color: var(--text-muted);
  flex-wrap: wrap;
  gap: var(--space-sm);
}

@media (max-width: 900px) {
  .footer-main {
    grid-template-columns: 1fr;
    gap: var(--space-xl);
  }
}
</style>
