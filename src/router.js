import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Dashboard.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('./views/Signup.vue')
    },
    //INVENTARIO
    {
      path: '/productos',
      name: 'productos',
      component: () => import('./views/ProductosInventario.vue')
    },
    //COMERCIAL
    {
      path: '/pedido',
      name: 'Pedido',
      component: ()=> import('./views/Pedido.vue')
    }
  ]
})  
  router.beforeEach((to, from, next) => {
    // redirect to login page if user is not logged in and trying to access a restricted page
    const publicPages = ['/login', '/','/signup']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem('user')
  
    if (authRequired && !loggedIn) {
      return next('/login')
    }
  
    next()
  })

  export default router




