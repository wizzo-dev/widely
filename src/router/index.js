import { createRouter, createWebHistory } from 'vue-router'
import JoinUs from '../views/JoinUs.vue'
import Activate from '../views/ActivatePage.vue'


const routes = [
  {
    path: '/',
    name: 'JoinUs',
    component: JoinUs
  },
  {
    path: '/Activate',
    name: 'Activate',
    component: Activate
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
