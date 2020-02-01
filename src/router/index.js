import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../manage/Home"
import Login from '../manage/Login'
import MusicHome from "../music/Home"
import SingerDetail from "../music/components/SingerDetail"
import AlbumDetail from "../music/components/AlbumDetail"

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
  },
  {
    path: '/music',
    name: 'music',
    component: MusicHome
  },
  {
    path: '/singer/:id',
    name: 'sdetail',
    component: SingerDetail
  },
  {
    path: '/album/:id',
    name: 'adetail',
    component: AlbumDetail
  }
]
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
