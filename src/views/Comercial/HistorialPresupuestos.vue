<template>
  <div>
    <v-card>
    <v-card-title>
      COTIZACIONES REALIZADAS
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="mdi-magnify"
        label="BUSQUEDA"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table :headers="headers" :items="cotizaciones" class="elevation-1"
    :search="search"
    :footer-props="{'items-per-page-text':'Cotizaciones por pagina'}"
    no-data-text = 'NO EXISTEN COTIZACIONES'>
    <template v-slot:top>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon @click="verPedido(item)">mdi-eye</v-icon>
      <v-icon @click="enviarCotizacion()">mdi-email-send-outline</v-icon>
    </template>
    </v-data-table>
    </v-card>

    <!-- DIALOG PARA VER LA COTIZACION -->
    <v-dialog
    v-model="dialog"
      persistent
      max-width="500"
      dark>
        <CardPedido :pedido="cotizacionAver" />
        <v-btn @click="dialog=false" color="success"> ACEPTAR</v-btn>
    </v-dialog>
     <v-snackbar v-model="snackbar" :timeout="2000" centered top :color="colorSnackBar">
        {{mensaje}}
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'
const BaseURL = 'http://localhost:3000/pedidos'
import CardPedido from '../../components/CardPedido'

export default {
data(){
    return{
        cotizaciones:[],
        headers:[
            {
                text:'NRO SOLCITUD',
                value:'id'
            },
            {
                text:'TIPO SOLCITUD',
                value:'solicitud'
            },
            {
                text:'FECHA PEDIDO',
                align: 'left',
                sortable: false,
                value: 'datosPedido.fecha'
            },
            {
                text:'FORMA ENTREGA',
                value:'datosPedido.formaEntrega'
            },
            {
                text:'FORMA PAGO',
                value:'datosPedido.formaPago'
            },
            {
                text:'CANTIDAD PRODUCTOS',
                value:'productos.length'
            },
            {
                text:'CLIENTE',
                value:'datosPedido.razonSocial'
            },
            { text: '', value: 'actions', sortable: false },
        ],
        search: '',
        snackbar: false,
        colorSnackBar: '',
        mensaje:'',
        cotizacionAver:{},
        dialog: false
    }
},
components:{
    CardPedido
},
mounted(){
    axios.get(BaseURL+'?q=COTIZADO').then(res => {
        if(res.status === 200){
            this.cotizaciones = res.data
        }
    })

},
methods:{
    verPedido(item){
        this.cotizacionAver = item
        this.dialog = true
    },
    enviarCotizacion(){
        this.mensaje = 'COTIZACION ENVIADA CON EXITO'
        this.colorSnackBar = 'success'
        this.snackbar = true
    }
}
}
</script>

<style>

</style>