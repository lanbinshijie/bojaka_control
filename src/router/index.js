import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    redirect:"/home"
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Settings.vue')
  },
  {
    path: '/update',
    name: 'update',
    component: () => import('@/views/Update.vue')
  },
  
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
