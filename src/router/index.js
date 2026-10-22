import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'discover',
    component: () => import('@/views/DiscoverView.vue'),
    meta: { title: 'Discover — VANTA CINEMA' }
  },
  {
    path: '/movies',
    name: 'movies',
    component: () => import('@/views/MoviesView.vue'),
    meta: { title: 'Movie Explorer — VANTA CINEMA' }
  },
  {
    path: '/movie/:id',
    name: 'movie-details',
    component: () => import('@/views/MovieDetailsView.vue'),
    meta: { title: 'Movie Details — VANTA CINEMA' }
  },
  {
    path: '/tv',
    name: 'tv',
    component: () => import('@/views/TVSeriesView.vue'),
    meta: { title: 'TV Series Explorer — VANTA CINEMA' }
  },
  {
    path: '/tv/:id',
    name: 'tv-details',
    component: () => import('@/views/TVDetailsView.vue'),
    meta: { title: 'TV Series Details — VANTA CINEMA' }
  },
  {
    path: '/mood-match',
    name: 'mood-match',
    component: () => import('@/views/MoodMatchView.vue'),
    meta: { title: 'Mood Match — VANTA CINEMA' }
  },
  {
    path: '/universities',
    name: 'universities',
    component: () => import('@/views/UniversitiesView.vue'),
    meta: { title: 'University Directory — VANTA CINEMA' }
  },
  {
    path: '/watchlist',
    name: 'watchlist',
    component: () => import('@/views/WatchlistView.vue'),
    meta: { title: 'Personal Watchlist — VANTA CINEMA' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page Not Found — VANTA CINEMA' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Update document title dynamically
router.afterEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
