import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../manage/Home";
import Login from '../manage/Login'


Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requireAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
