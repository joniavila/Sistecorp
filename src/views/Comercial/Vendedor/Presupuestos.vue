<template>
  <div>
    <v-data-table :headers="headers" :items="pedidos" class="elevation-1"
    :footer-props="{'items-per-page-text':'Pedidos por pagina'}"
    no-data-text = 'NO TIENE UN HISTORIAL DE PEDIDOS REGISTRADOS'>
    <template v-slot:top>
    <v-toolbar flat>
        <v-toolbar-title>COTIZACIONES PENDIENTES</v-toolbar-title>
    </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon @click="verPedido(item)">mdi-eye</v-icon>
      <v-icon @click="cotizar(item)">mdi-currency-usd</v-icon>
    </template>
    </v-data-table>
    <!-- DIALOG PARA VER EL PEDIDO -->
    <v-dialog
    v-model="dialog"
      persistent
      max-width="500"
      dark>
    <CardPedido :pedido="pedidoAver" />
    <v-divider>
    </v-divider>
        <v-btn
            color="green darken-1"
            @click="hideDialog()"
          >
            Aceptar
          </v-btn>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
const BaseURL = 'http://localhost:3000/pedidos'
import CardPedido from '../../../components/CardPedido'

export default {
data(){
    return{
        headers:[
            {
                text:'NRO SOLCITUD',
                value:'id'
            },
            {
                text:'FECHA PEDIDO',
                align: 'left',
                sortable: false,
                value: 'datosPedido.fecha'
            },
            {
                text:'FORMA PAGO',
                value:'datosPedido.formaPago'
            },
            {
                text:'RAZON SOCIAL',
                value:'datosPedido.razonSocial'
            },
            {
                text:'CUIT',
                value:'datosPedido.cuit'
            },
            {
                text:'USUARIO',
                value:'datosPedido.nombreContacto'
            },
            { text: 'ACCIONES', value: 'actions', sortable: false },
        ],
        pedidos:[],
        pedidoAver: {},
        dialog: false,
    }
},
components:{
    CardPedido,
},
mounted(){
    axios.get(BaseURL+`?q=PENDIENTE`).then(res =>{
        if(res.status === 200){
            this.pedidos = res.data
        }
    })
},
methods:{
    verPedido(item){
        this.pedidoAver = item
        this.dialog = true
    },
    hideDialog(){
        this.dialog = false
        this.pedidoAver = {}
    },
    cotizar(item){
        this.$store.state.pedidoAcotizar = item
        this.$router.push('/cotizador')
    }
}
}
</script>

<style>

</style>