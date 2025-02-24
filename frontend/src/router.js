import { createRouter, createWebHistory } from 'vue-router'

// Import your page components
import Home from './pages/Home.vue'
import Sonarr from './pages/Sonarr.vue'
import Radarr from './pages/Radarr.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/sonarr', component: Sonarr },
  { path: '/radarr', component: Radarr }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
