<template>
<div>
  <v-data-table :headers="headers" :items="pedidos" class="elevation-1"
    :footer-props="{'items-per-page-text':'Pedidos por pagina'}"
    no-data-text = 'NO TIENE UN HISTORIAL DE PEDIDOS REGISTRADOS'>
    <template v-slot:top>
    <v-toolbar flat>
        <v-toolbar-title>PEDIDOS Y COTIZACIONES MIAS</v-toolbar-title>
    </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon v-if="item.estado != 'FACTURADO'" @click="deleteItem(item)" >
        mdi-delete
      </v-icon>
      <v-icon @click="verPedido(item)">mdi-eye</v-icon>
    </template>
    </v-data-table>
    <v-alert :color="colorSnackBar" v-model="snackbar" centered dismissible>{{mensaje}}</v-alert>
    <!-- DIALOG PARA VER EL PEDIDO SIN COTIZAR -->
    <v-dialog
    v-model="dialog"
      persistent
      max-width="500"
      dark>
    
        <v-card v-if="pedidoAver">
        <v-card-title class="headline">
            {{pedidoAver.solicitud}} NRO {{ pedidoAver.id}}
        </v-card-title>
        <v-card-text class="primary ">
        <v-card-title>DATOS CLIENTE</v-card-title>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Mail Cliente: {{pedidoAver.datosPedido.usuarioRegistrado}}</v-list-item-title>
                    <v-list-item-title>Razon Social: {{pedidoAver.datosPedido.razonSocial}}</v-list-item-title>
                    <v-list-item-title>CUIT: {{pedidoAver.datosPedido.cuit}}</v-list-item-title>
                    <v-list-item-title>Forma de Pago: {{pedidoAver.datosPedido.formaPago}}</v-list-item-title>
                    <v-list-item-title>Forma de Entrega: {{pedidoAver.datosPedido.formaEntrega}}</v-list-item-title>
                    <v-list-item-title>Fecha Estimada de Entrega: {{pedidoAver.datosPedido.fechaEntrega}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        <v-card-title>PRODUCTOS</v-card-title>
            <template>
                <v-simple-table dense>
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-left">
                            PRODUCTO
                        </th>
                        <th class="text-left">
                            CANTIDAD
                        </th>
                        <th class="text-left">
                            PRECIO + IVA
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="item in pedidoAver.productos"
                        :key="item.id"
                        >
                        <td>{{ item.NOMBRE }}</td>
                        <td>{{ item.CANTIDAD }}</td>
                        <td>{{ item.PRECIO }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </template>
            <v-card-title style="color:black" v-if="pedidoAver.estado === 'PENDIENTE'">PEDIDO DE COTIZACION PENDIENTE</v-card-title>   
            <v-card-title v-if="pedidoAver.estado === 'ACEPTADO'">MONTO A FACTURAR: $ {{montoFactura}}</v-card-title>   
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            @click="hideDialog()"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>

<script>
import axios from 'axios'
const BaseURL = 'http://localhost:3000/pedidos'
import {mapState} from 'vuex'

export default {
    data(){
    return{
        pedidos:[],
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
                text:'ESTADO',
                value:'estado'
            },
            { text: '', value: 'actions', sortable: false },
        ],
        mensaje:'',
        snackbar:false,
        nombreContacto: '',
        colorSnackBar: '',
        cuitCliente: '',
        dialog:false,
        pedidoAver:'',
        montoFactura: 0,
        usuarioRegistrado:{}
    }
},
computed:{
    ...mapState(['user'])
},
created(){
    window.setInterval(() => {
        this.snackbar = false
    }, 4000)
},
mounted(){
    // http://localhost:3000/pedidos?q=Jonas%20Avila
    this.cuitCliente = this.$store.state.user.cuit
    axios.get(BaseURL+`?q=${this.cuitCliente}`).then(res => {
        this.pedidos = res.data
    })
    this.usuarioRegistrado = this.$store.state.user
},
methods:{
    async deleteItem(item){
      try {
        await axios.delete(`${BaseURL}/${item.id}`).then(res => {
            if(res.status === 200){
              this.mensaje = "PEDIDO ELIMINADO CON EXITO"
              this.colorSnackBar = 'green'
              this.snackbar = true
            }else{
              this.mensaje = 'ERROR: EL PEDIDO NO SE ELIMINO, INTENTE NUEVAMENTE LUEGO'
              this.colorSnackBar = 'red'
              this.snackbar = true
            }
          }).then(()=>{
            axios.get(BaseURL+`?q=${this.cuitCliente}`).then(res => {
                this.pedidos = res.data
            })
          })
      } catch (error) {
        this.mensaje = 'ERROR: '+error
        this.colorSnackBar = 'red'
        this.snackbar = true
      }
    },
    verPedido(item){
        this.dialog = true,
        this.pedidoAver = item
        if(this.pedidoAver.monto){
            this.montoFactura = this.pedidoAver.monto*1.21
        }
    },
    hideDialog(){
        this.dialog = false
        this.pedidoAver = ''
        this.montoFactura = 0
    }
}
}
</script>

<style>

</style>