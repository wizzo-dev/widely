import { createRouter, createWebHistory } from 'vue-router'
import JoinUs from '../views/JoinUs.vue'

const routes = [
  {
    path: '/',
    name: 'JoinUs',
    component: JoinUs
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
