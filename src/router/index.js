import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/home'
import Welcome from '@/views/welcome/Welcome'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      redirect: {path: 'welcome'},
      children: [{
        path: 'welcome',
        name: 'Welcome',
        component: Welcome
      }]
    }
  ]
})
