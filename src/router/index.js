import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from "../manage/Home"
import Login from '../manage/Login'

import MusicHome from "../music/Home"
import SingerDetail from "../music/components/SingerDetail"
import AlbumDetail from "../music/components/AlbumDetail"
import Album from "../music/components/Album";
import Singer from "../music/components/Singer";
import MyMusic from "../music/components/MyMusic";
import SearchPage from "../music/components/SearchPage";

Vue.use(VueRouter)

const routes = [
  {
    path: '/manage',
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
    path: '/singer',
    name: 'singer',
    component: Singer
  },
  {
    path: '/album',
    name: 'album',
    component: Album
  },
  {
    path: '/myMusic/:username',
    name: 'myMusic',
    component: MyMusic
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
  },
  {
    path: '/search/:keyword',
    name: 'searchPage',
    component: SearchPage
  }
]
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

/**
 * 重写路由的push方法
 */
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

export default router
