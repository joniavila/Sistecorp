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
      path: '/infoPedido&cotizacion',
      name: 'DatosPedido',
      component: ()=> import('./views/Comercial/DatosPedido.vue')
    },
    {
      path: '/cargaProductos',
      name: 'cargaProductosCotizacion',
      component: ()=> import('./views/Comercial/Cotizacion.vue')
    },
    {
      path: '/pedidos',
      name: 'Historial',
      component: ()=> import('./views/Comercial/HistorialPedidos.vue')
    },
    {
      path: '/pedidoWeb',
      name: 'pedidoWeb',
      component: ()=> import('./views/Comercial/PedidoWeb.vue')
    },
    {
      path: '/confirmacionPedido',
      name: 'confirmacionPedido',
      component: ()=> import('./views/Comercial/Pedido.vue')
    },
    // ADMINISTRACION
    {
      path: '/facturacion',
      name: 'facturacion',
      component: ()=> import('./views/Administracion/Facturacion.vue')
    },
    // NEGOCIO
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('./views/Negocio/Dashboard.vue')
    },
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




