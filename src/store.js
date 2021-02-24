import Vue from 'vue'
import Vuex from 'vuex'
//import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ingreso:false,
    user: null,
    isNewUser: true,
    usuarioRegistrado: false,
    administrador: false,
    vendedor:false,
    superAdministrador:false,
    categorias:[
      'MICRO',
      'REDES',
      'ENERGIA',
      'IMPRESION',
      'TELEFONIA',
      'IMAGEN Y SONIDO',
      'ILUMINACION',
      'OTROS'
    ],
    proveedores:[
      'AIR',
      'GRUPONUCLEO',
      'MASNET',
      'FERRATO',
      'TRADEIT',
      'STARLIGHT',
    ],
    formasPagoOpcionales: [
      'Contado Efectivo',
      'Contado Transferencia',
      'Tarjeta',
      'Tarjeta en cuotas',
      'Cheque a 30 dias',
      'Cheque a 60 dias',
      'Cheque a 90 dias'
    ],
    formasDeEntregaOpcionales:[
      'Envio a cargo del proveedor',
      'Retiro por oficina comercial',
      'Envio por correo'
    ],
    datosPedidoNuevo:{
      fecha:'',
      fechaEntrega:'',
      nombreContacto:'',
      mailContacto: '',
      formaPago:'',
      formaEntrega:''
    },
    productosPedido:[],
    banner: true,
    esPedido: false,
    productosPreferencia:[],
    pedidoAcotizar:'',
    productosCotizacion:[],
    dialogCotizacion:false,
    montoCotizacion:0
  },  
  mutations: {
  },
  actions: {
   }
})
