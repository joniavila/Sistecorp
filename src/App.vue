<template>
  <v-app>
    <v-app-bar app dark>
      <v-toolbar-title v-if="nombreUsuario">Hola {{nombreUsuario}}!</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-show="!ingreso"
        v-for="link in home"
        :key="`${link.label}-header-link`"
        text
        rounded
        :to="link.url"
      >
        {{ link.label }}
      </v-btn>
      <!-- OPCIONES PARA EL USUARIO REGISTRADO -->
      <div v-if="ingreso" >
        <!-- ICONO PARA DESLOGUEARSE -->
        <v-btn icon @click="logout">
          <v-icon>
            {{logoSesion}}
          </v-icon>
        </v-btn>
        <!-- MODULO DE CLIENTE -->
        <v-menu v-if="usuario || vendedorApp || superAdministradorApp" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Cliente
          </v-btn>
        </template>
            <v-list>
              <!-- MODULO DE CLIENTES PARA VENDEDORES -->
              <div v-if="vendedorApp">
               <v-list-item 
                v-for="(vendedor,i) in moduloClienteVendedor"
                :key="i"
              >
              <v-list-item-title >
                <v-btn
                :to="vendedor.url"
                text
                rounded>
                {{ vendedor.label }}
                </v-btn>
                </v-list-item-title>
               </v-list-item>
              </div>
              <div v-else>
              <v-list-item
                v-for="(cuenta,i) in moduloCliente"
                :key="i"
              >
              <v-list-item-title>
                <v-btn
                :to="cuenta.url"
                text
                rounded>
                {{ cuenta.label }}
                </v-btn>
                </v-list-item-title>
              </v-list-item>
              </div>
            </v-list>     
      </v-menu>
        <!-- MODULO DE COMERCIAL -->  
      <v-menu v-if="usuario || vendedorApp || superAdministradorApp" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Comercial
          </v-btn>
        </template>
        <v-list>
        <!-- MODULO COMERCIAL PARA VENDEDORES -->
        <div v-if="vendedorApp">
              <v-list-item
                v-for="(vended,i) in moduloComercialVendedor"
                :key="i"
              >
              <v-list-item-title >
                <v-btn
                :to="vended.url"
                text
                rounded>
                {{ vended.label }}
                </v-btn>
                </v-list-item-title>
              </v-list-item>
        </div>
        <div v-else>
              <v-list-item
                v-for="(user,i) in moduloComercial"
                :key="i"
              >
              <v-list-item-title >
                <v-btn
                :to="user.url"
                text
                rounded>
                {{ user.label }}
                </v-btn>
                </v-list-item-title>
              </v-list-item>
        </div>
        </v-list>     
      </v-menu>
      <!-- MODULO DE NEGOCIO -->
      <v-menu v-if="administradorApp || superAdministradorApp" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Negocio
          </v-btn>
        </template>
            <v-list>
              <v-list-item
                v-for="(admin,i) in moduloNegocio"
                :key="i"
              >
              <v-list-item-title >
                <v-btn
                :to="admin.url"
                text
                rounded>
                {{ admin.label }}
                </v-btn>
                </v-list-item-title>
              </v-list-item>
            </v-list>
      </v-menu>
      <!-- MODULO DE ADMINISTRACION -->
      <v-menu v-if="administradorApp || superAdministradorApp" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Administracion
          </v-btn>
        </template>
            <v-list>
              <v-list-item
                v-for="(comer,i) in moduloAdministracion"
                :key="i"
              >
              <v-list-item-title >
                <v-btn
                :to="comer.url"
                text
                rounded>
                {{ comer.label }}
                </v-btn>
                </v-list-item-title>
              </v-list-item>
            </v-list>
      </v-menu>
      <!-- MODULO DE INVENTARIO -->
      <v-menu v-if="vendedorApp || superAdministradorApp" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Inventario
          </v-btn>
        </template>
            <v-list>
              <v-list-item
                v-for="(comer2,i) in moduloInventario"
                :key="i"
              >
              <v-list-item-title >
                <v-btn
                :to="comer2.url"
                text
                rounded>
                {{ comer2.label }}
                </v-btn>
                </v-list-item-title>
              </v-list-item>
            </v-list>
      </v-menu>
    </div>      
    </v-app-bar>
    <!-- CONTENT -->
    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer color="primary lighten-1" padless>
      <v-layout justify-center wrap>
        <v-flex primary lighten-2 py-4 text-center white--text xs12>
          DINAMIC0 <v-icon large>mdi-autorenew</v-icon>{{ new Date().getFullYear() }} <strong></strong>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import {mapState} from 'vuex'
import { mdiAccountArrowLeft } from '@mdi/js';

export default {
  name: 'App',
  data() {
    return {
      nombreUsuario: null,
      logoSesion: mdiAccountArrowLeft,
      usuario: false,
      ingresoApp:false,
      administradorApp:false,
      vendedorApp: false,
      home: [
        {
          label: 'Home',
          url: '/'
        },
        {
          label: 'Ingreso',
          url: '/login'
        },
        {
          label: 'Registro',
          url: '/signup'
        }
      ],
      moduloCliente:[
        {
          label:'Datos Cuenta',
          url:'/datosCuentaUsuario'
        },
        {
          label:'Preferencias',
          url: '/preferencias'
        },
      ],
      moduloClienteVendedor:[
        {
          label:'Registrar Cliente',
          url:'registroCliente',
        },
        {
          label:'Promociones',
          url:'promociones'
        }
      ],
      moduloComercialVendedor:[
         {
          label:'Crear pedido Web',
          url:'/pedidoWeb'
        },
        {
          label:'cotizaciones Pendientes',
          url:'/presupuestos',
        },
        {
          label:'Historial cotizaciones',
          url:'/historialCotizaciones',
        },
      ],
      moduloComercial:[
        {
          label:'Crear pedido Web',
          url:'/pedidoWeb'
        },
        {
          label:'Solicitar cotizacion',
          url:'/infoPedido&cotizacion'
        },
        {
          label:'Historial de pedidos',
          url: '/pedidos'
        }
      ],
      moduloAdministracion:[
        {
          label: 'Facturacion',
          url:'/facturacion'
        },
        {
          label:'Presupuestos',
          url:'/presupuestos'
        },
        {
          label:'Historial de Presupuestos',
          url:'/historial'
        },
        {
          label:'Compras a Proveedor',
          url:'/compras'
        },
      ],
      moduloInventario:[
        {
          label: 'Productos',
          url:'/productos'
        },
      ],
      moduloNegocio:[
        {
            label: 'Dashboard',
            url: '/dashboard'
        },
        {
          label:'Cuenta',
          url:'/cuentaBancaria'
        }
      ],
      pedidoWeb: false,
      cantidadProductos: this.$store.state.productosPedido.length,
      superAdministradorApp:false
    }
  },
  methods: {
    logout(){
      localStorage.clear()
      this.$router.push('/')
      this.$store.state.usuario = false
      location.reload()
    }
  },
  computed:{
    ...mapState(['usuarioRegistrado','administrador','ingreso','vendedor','user','esPedido','productosPedido','superAdministrador'])
  },
  watch:{
    usuarioRegistrado(newValue){
      this.usuario = newValue
    },
    administrador(newValue){
      this.administradorApp = newValue
    },
    ingreso(newValue){
      this.ingresoApp = newValue
    },
    vendedor(newValue){
      this.vendedorApp = newValue
    },
    user(newValue){
      this.nombreUsuario = newValue.name
    },
    esPedido(newValue){
      this.pedidoWeb = newValue
    },
    productosPedido(newValue){
      this.cantidadProductos = newValue
    },
    superAdministrador(newValue){
      this.superAdministradorApp = newValue
    }
  }
}
</script>
