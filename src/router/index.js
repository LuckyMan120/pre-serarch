import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

import { Magic } from 'magic-sdk'
const magic = new Magic(process.env.VUE_APP_MAGIC_PUBLISHABLE_KEY)

Vue.use(VueRouter)

const routes = [
  {
    path: '/index.html',
    name: 'Home',
    component: Home,
    alias: '/',
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
  },
  {
    path: '/scans',
    name: 'Scans',
    component: () => import('../views/Scans.vue'),
  },
  {
    path: '/project/:project_id',
    name: 'Project',
    component: () => import('../views/Project.vue'),
    props: true,
  },
  {
    path: '/project/:project_id/:experiment_id',
    name: 'Experiment',
    component: () => import('../views/Experiment.vue'),
    props: true,
  },
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: () => import('../views/Onboarding.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

router.beforeEach(async (to, from, next) => {
  const isLoggedIn = await magic.user.isLoggedIn()
  if (to.name == 'Home') {
    if (isLoggedIn) {
      next({ path: '/dashboard' })
    }
    next()
  } else if (isLoggedIn) {
    next()
  } else {
    next({ path: '/' })
  }
})

export default router
