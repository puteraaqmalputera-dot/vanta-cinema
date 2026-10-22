<template>
  <div v-if="!isConfigured" class="config-banner" role="region" aria-label="TMDB API Configuration Notice">
    <div class="banner-content">
      <div class="banner-badge">Setup Required</div>
      <h3 class="banner-title">TMDB API Read Access Token Needed</h3>
      <p class="banner-desc">
        To browse live TMDB movie discovery, popular films, and trailers, provide your TMDB v4 Read Access Token. 
        (TV Series powered by TVmaze are live and require no API key).
      </p>

      <div class="setup-steps">
        <div class="step-card">
          <span class="step-num">Option 1</span>
          <span class="step-text">Add to <code>.env</code> file:</span>
          <pre class="step-code">VITE_TMDB_READ_TOKEN=your_token_here</pre>
        </div>

        <div class="step-card">
          <span class="step-num">Option 2</span>
          <span class="step-text">Or enter token for this browser session:</span>
          <div class="quick-input-row">
            <input 
              v-model="inputToken" 
              type="password" 
              placeholder="Paste TMDB Bearer Token..." 
              class="token-input"
              aria-label="TMDB Read Token"
            />
            <button type="button" class="btn btn-primary" @click="saveToken">
              Save Token
            </button>
          </div>
        </div>
      </div>

      <div class="banner-footer">
        <span class="security-note">
          <strong>Security Notice:</strong> In static client-side applications, tokens bundled in the browser are not secret. Use only dedicated development credentials.
        </span>
        <a 
          href="https://www.themoviedb.org/settings/api" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="api-link"
        >
          Get TMDB Token &rarr;
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { hasTmdbToken, setRuntimeTmdbToken, getTmdbToken } from '@/services/tmdb'

const emit = defineEmits(['configured'])

const isConfigured = ref(false)
const inputToken = ref('')

function checkConfig() {
  isConfigured.value = hasTmdbToken()
}

function saveToken() {
  if (inputToken.value && inputToken.value.trim().length > 10) {
    setRuntimeTmdbToken(inputToken.value.trim())
    checkConfig()
    emit('configured')
    window.location.reload()
  }
}

onMounted(() => {
  checkConfig()
})
</script>

<style scoped>
.config-banner {
  background: linear-gradient(135deg, rgba(28, 28, 34, 0.95) 0%, rgba(20, 20, 24, 0.98) 100%);
  border: 1px solid var(--accent-gold-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
  margin-bottom: var(--space-2xl);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.banner-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.banner-badge {
  align-self: flex-start;
  padding: 4px 10px;
  background: var(--accent-gold-muted);
  border: 1px solid var(--accent-gold);
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--accent-gold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.banner-title {
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--text-primary);
}

.banner-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 800px;
}

.setup-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-xs);
}

.step-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
}

.step-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent-gold);
  text-transform: uppercase;
}

.step-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.step-code {
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.8rem;
  color: #E2E8F0;
  border: 1px solid var(--border-subtle);
}

.quick-input-row {
  display: flex;
  gap: var(--space-xs);
}

.token-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--border-medium);
  color: var(--text-primary);
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  outline: none;
}

.token-input:focus {
  border-color: var(--accent-gold);
}

.banner-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border-subtle);
  font-size: 0.8rem;
  flex-wrap: wrap;
}

.security-note {
  color: var(--text-muted);
}

.api-link {
  color: var(--accent-gold);
  font-weight: 500;
}

.api-link:hover {
  text-decoration: underline;
}
</style>
