<template>
  <v-app>
    <v-app-bar app dark>
      <v-toolbar-title v-if="nombreUsuario">Hola {{nombreUsuario}}!</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-show="!ingreso"
        v-for="link in links"
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
        <!-- OPCIONES DE CUENTA -->
        <v-menu v-if="usuario || administradorApp" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Cliente
          </v-btn>
        </template>
            <v-list>
              <v-list-item
                v-for="(cuenta,i) in linksCuenta"
                :key="i"
              >
              <v-list-item-title >
                <v-btn
                :to="cuenta.url"
                text
                rounded>
                {{ cuenta.label }}
                </v-btn>
                </v-list-item-title>
              </v-list-item>
            </v-list>     
      </v-menu>
        <!-- OPCIONES DE USUARIO -->  
      <v-menu v-if="usuario || administradorApp" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Comercial
          </v-btn>
        </template>
            <v-list>
              <v-list-item
                v-for="(user,i) in linksUsuario"
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
            </v-list>     
      </v-menu>
      <v-menu v-if="usuario" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Cliente
          </v-btn>
        </template>
            <v-list>
              <v-list-item
                v-for="(user2,i) in linksUsuario2"
                :key="i"
              >
              <v-list-item-title >
                <v-btn
                :to="user2.url"
                text
                rounded>
                {{ user2.label }}
                </v-btn>
                </v-list-item-title>
              </v-list-item>
            </v-list>
      </v-menu>
      <!-- OPCIONES DE ADMINISTRADOR -->
      <v-menu v-if="administradorApp" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Negocio
          </v-btn>
        </template>
            <v-list>
              <v-list-item
                v-for="(admin,i) in linksAdministracion"
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
      <!-- OPCIONES DE VENDEDOR -->
      <v-menu v-if="vendedorApp || administradorApp" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Administracion
          </v-btn>
        </template>
            <v-list>
              <v-list-item
                v-for="(comer,i) in linksVendedor"
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
      <v-menu v-if="vendedorApp || administradorApp" open-on-hover app dark offset-y>
        <template v-slot:activator="{ on}">
          <v-btn v-on="on" text rounded>
            Inventario
          </v-btn>
        </template>
            <v-list>
              <v-list-item
                v-for="(comer2,i) in linksVendedor2"
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
          {{ new Date().getFullYear() }} <strong></strong>
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
      links: [
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
      linksCuenta:[
        {
          label:'Datos Cuenta',
          url:'/datosCuentaUsuario'
        },
        {
          label:'Usuario/Contraseña',
          url:'/UsuarioContraseña'
        },
        {
          label:'Preferencias',
          url: '/preferencias'
        }
      ],
      linksUsuario:[
        {
          label:'Crear pedido Web',
          url:'/pedidoWeb'
        },
        {
          label:'Solicita cotizacion',
          url:'/infoPedido&cotizacion'
        },
        {
          label:'Historial de pedidos',
          url: '/pedidos'
        }
      ],
      linksUsuario2:[
        {
          label:'Datos Cliente',
          url:'/cliente'
        },
        {
          label:'Preferencias',
          url:'/preferencias'
        },
      ],
      linksVendedor:[
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
      ],
      linksVendedor2:[
        {
          label: 'MarkUp',
          url:'/markup'
        },
        {
          label: 'Productos',
          url:'/productos'
        },
      ],
      linksAdministracion:[
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
      cantidadProductos: this.$store.state.productosPedido.length
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
    ...mapState(['usuarioRegistrado','administrador','ingreso','vendedor','user','esPedido','productosPedido'])
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
    }
  }
}
</script>
