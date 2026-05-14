import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import CreateView from './views/CreateView.vue';
import PreviewView from './views/PreviewView.vue';
import BrowseView from './views/BrowseView.vue';
import PostView from './views/PostView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/create', name: 'create', component: CreateView },
  { path: '/preview', name: 'preview', component: PreviewView },
  { path: '/browse', name: 'browse', component: BrowseView },
  { path: '/post/:id', name: 'post', component: PostView },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
