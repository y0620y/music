import Vue from 'vue'
import VueRouter from 'vue-router'
import Client from '../views/Client.vue'
import Music from "../views/Music";
import Login from '../views/Login.vue'
import Test from '../views/Test.vue'
import Mongoose from '../views/Mongoose.vue'
import Mocha from '../views/Mocha.vue'

Vue.use(VueRouter)



const routes = [
  {
    path: '/',
    name: 'Music',
    component: Music
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/client',
    name: 'client',
    component: Client
  },
  {
    path: '/mongoose',
    name: 'mongoose',
    component: Mongoose
  },
  {
    path: '/mocha',
    name: 'mocha',
    component: Mocha
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  },

  
]
const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
