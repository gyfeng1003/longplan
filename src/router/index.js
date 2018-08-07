import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Main from '@/views/main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },{
      path: '/home',
      name: 'home',
      component: Home,
    },{
      path: '/main',
      name: 'main',
      component: Main,
    }
  ]
})
