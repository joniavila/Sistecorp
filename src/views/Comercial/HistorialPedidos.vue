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
    <v-snackbar v-model="snackbar" :timeout="2000" centered top :color="colorSnackBar">
        {{mensaje}}
    </v-snackbar>
   <!-- DIALOG PARA VER EL PEDIDO/COTIZACION -->
    <v-dialog
    v-model="dialog"
      persistent
      max-width="500"
      dark>
        <CardPedido :pedido="pedidoAver" />
        <v-btn @click="dialog=false" color="error"> CERRAR</v-btn>
        <v-btn v-if="pedidoAver.estado === 'COTIZADO'" @click="confirmarPresupuesto" color="success"> ACEPTAR PRESUPUESTO</v-btn>
    </v-dialog>

    <!-- DIALOG PARA CONFIRMAR PRESUPUESTO -->
    <v-dialog
    v-model="dialogConfirmacion"
      persistent
      max-width="500"
      dark>
      <v-card>
        <v-card-title class="headline">
          Esta seguro que sea confirmar el presupuesto?
        </v-card-title>
        <v-card-text>La confirmacion del presupuesto conlleva la reserva de los productos y su posterior facturacion.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            text
            @click="dialogConfirmacion = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            text
            @click="confirmarPresupuesto"
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
import CardPedido from '../../components/CardPedido'

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
        usuarioRegistrado:{},
        dialogConfirmacion: false
    }
},
components:{
    CardPedido
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
    },
    hideDialog(){
        this.dialog = false
        this.pedidoAver = ''
        this.montoFactura = 0
    },
    async confirmarPresupuesto(){

        var pedidoConfirmado = {
            datosPedido: this.pedidoAver.datosPedido,
            productos: this.pedidoAver.productosCotizados,
            monto: this.pedidoAver.monto,
            estado: 'ACEPTADO',
            solicitud:'COTIZACION'
        }
            await axios.put(BaseURL+`/${this.pedidoAver.id}`,pedidoConfirmado).then(res =>{
                if(res.status === 201 || res.status === 200){
                    this.mensaje = "SE HA CONFIRMADO CON EXITO"
                    this.colorSnackBar = 'success'
                    this.snackbar = true
                    this.dialog = false
                }else{
                    this.dialog = false
                    this.mensaje = "SE PRODUJO UN ERROR EN EL PROCESO DE CONFIRMACION, INTENTE NUEVAMENTE"
                    this.colorSnackBar = 'error'
                    this.snackbar = true
                }
            }).then( async()=>{
                // ACTUALIZA LA LISTA DE PEDIDOS
                axios.get(BaseURL+`?q=${this.cuitCliente}`).then(res => {
                    this.pedidos = res.data
                })
            })
    },
}
}
</script>

<style>

</style>