import { createRouter, createWebHistory } from 'vue-router';

// Import des vues
const HomeView = () => import('../views/HomeView.vue');
const SemestersView = () => import('../views/SemestersView.vue');
const StudentsView = () => import('../views/StudentsView.vue');
const StudentDetailView = () => import('../views/StudentDetailView.vue');

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/semestres',
    name: 'semestres',
    component: SemestersView
  },
  {
    path: '/semestre/:id/etudiants',
    name: 'etudiants-semestre',
    component: StudentsView,
    props: true
  },
  {
    path: '/etudiant/:id',
    name: 'etudiant-detail',
    component: StudentDetailView,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;