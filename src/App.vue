<template>
  <div class="vanta-app-layout">
    <!-- Accessible skip link for keyboard users -->
    <a href="#main-content" class="skip-to-content">
      Skip to main content
    </a>

    <!-- Application Top Navigation -->
    <AppHeader />

    <!-- Main View Content Area -->
    <div id="main-content" class="app-content-wrapper" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <PageTransition>
          <component :is="Component" />
        </PageTransition>
      </RouterView>
    </div>

    <!-- Back to Top Smooth Scroll Float -->
    <BackToTop />

    <!-- Application Footer with Legal and API Attributions -->
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import BackToTop from '@/components/common/BackToTop.vue'
import PageTransition from '@/components/common/PageTransition.vue'
</script>

<style scoped>
.vanta-app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-base);
  color: var(--text-primary);
}

.app-content-wrapper {
  flex: 1;
  outline: none;
}

.skip-to-content {
  position: absolute;
  top: -40px;
  left: 20px;
  background: var(--accent-gold);
  color: var(--bg-base);
  padding: 8px 16px;
  font-weight: 600;
  font-size: 0.85rem;
  border-radius: var(--radius-sm);
  z-index: 1000;
  transition: top 0.2s ease;
}

.skip-to-content:focus {
  top: 15px;
}
</style>
