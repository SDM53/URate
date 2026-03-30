import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'

const routes = [
  { path: '/', component: HomeView },
  // These two are placeholders so RouterLink doesn't throw errors
  // We'll build them out properly later
  { path: '/post/:id', component: { template: '<div class="p-8 text-gray-500">Post page coming soon</div>' } },
  { path: '/create',   component: { template: '<div class="p-8 text-gray-500">Create page coming soon</div>' } },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})