import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/reset.css'

Vue.config.productionTip = false
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


//路由守卫
router.beforeEach((to, from, next) => {
  window.console.log(to);
  window.console.log(from);
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if(JSON.parse(localStorage.getItem('islogin'))){ //判断本地是否存在access_token
      next();
    }else {
      next({
        path:'/login'
      })
    }
  }
  else {
    next();
  }
  /*如果本地 存在 token 则 不允许直接跳转到 登录页面*/
  if(to.fullPath == "/login"){
    if(JSON.parse(localStorage.getItem('islogin'))){
      next({
        path:from.fullPath
      });
    }else {
      next();
    }
  }
});