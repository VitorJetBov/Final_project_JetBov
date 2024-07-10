import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import PasturesView from '@/views/PasturesView.vue';
import LotsView from '@/views/LotsView.vue';
import AnimalsView from '@/views/AnimalsView.vue';
import RotationView from '@/views/RotationView.vue';
import AnimalProjectionView from '@/views/AnimalProjectionView.vue';

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/pastures', name: 'Pastures', component: PasturesView },
  { path: '/lots', name: 'Lots', component: LotsView },
  { path: '/animals', name: 'Animals', component: AnimalsView },
  { path: '/rotation', name: 'Rotation', component: RotationView },
  { path: '/animal-projection', name: 'AnimalProjectionView', component: AnimalProjectionView }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
