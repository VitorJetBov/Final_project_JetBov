import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PasturesView from '@/views/PasturesView.vue';
import AnimalsView from '@/views/AnimalsView.vue';
import LotsView from '@/views/LotsView.vue';
import RotationView from '@/views/RotationView.vue';
import AnimalProjectionView from '@/views/AnimalProjectionView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/pastures', name: 'PasturesView', component: PasturesView },
  { path: '/animals', name: 'AnimalsView', component: AnimalsView },
  { path: '/lots', name: 'LotsView', component: LotsView },
  { path: '/rotation', name: 'RotationView', component: RotationView },
  { path: '/animal-projection', name: 'AnimalProjectionView', component: AnimalProjectionView },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
