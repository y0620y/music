import Vue from 'vue'
import VueRouter from 'vue-router'
import ManageHome from '../manage/Home'
import Login from '../manage/Login'
import AlbumManage from "../manage/components/Album"
import SingerManage from "../manage/components/Singer"
import UserManage from "../manage/components/User"
import UserCollect from "../manage/components/Collect"

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
    name: 'ManageHome',
    component: ManageHome,
    meta: { requireAuth: true }
  },
  {
    path: '/singerManage',
    name: 'singerManage',
    component: SingerManage,
    meta: { requireAuth: true }
  },
  {
    path: '/albumManage',
    name: 'albumManage',
    component: AlbumManage,
    meta: { requireAuth: true }
  },
  {
    path: '/userManage',
    name: 'userManage',
    component: UserManage,
    meta: { requireAuth: true }
  },
  {
    path: '/collect',
    name: 'UserCollect',
    component: UserCollect,
    meta: { requireAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'music',
    component: MusicHome
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
