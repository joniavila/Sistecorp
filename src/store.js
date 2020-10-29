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
    ]
  },
  mutations: {
  },
  actions: {
   }
})
