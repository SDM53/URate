import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import CreateView from './views/CreateView.vue';
import PreviewView from './views/PreviewView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/create', name: 'create', component: CreateView },
  { path: '/preview', name: 'preview', component: PreviewView },
  {
    path: '/post/:id',
    name: 'post',
    component: { template: '<div class="p-8" style="color: #c4b5fd;">Post page coming soon</div>' },
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
