<template>
  <div>
  <v-data-table :headers="headers" :items="pedidos" class="elevation-1"
    :footer-props="{'items-per-page-text':'Pedidos por pagina'}"
    no-data-text = 'NO TIENE UN HISTORIAL DE PEDIDOS REGISTRADOS'>
    <template v-slot:top>
    <v-toolbar flat>
        <v-toolbar-title>PEDIDOS Y COTIZACIONES</v-toolbar-title>
    </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon v-if="item.estado === 'ACEPTADO'" small @click="cargarOrden(item)" >
        mdi-sticker-check-outline
      </v-icon>
    </template>
    </v-data-table>
    <v-alert :color="colorSnackBar" v-model="snackbar" timeout="2000" centered dismissible>{{mensaje}}</v-alert>
    <!-- DIALOG PARA CONFIRMAR LA FACTURACION -->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500"
    >
    <v-card v-if="pedidoAFacturar" dark>
        <v-card-title class="headline">
          Desea facturar dicha solicitud ?
        </v-card-title>
        <v-card-text class="primary">
        <v-card-title>DATOS CLIENTE</v-card-title>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Mail Cliente: {{pedidoAFacturar.datosPedido.usuarioRegistrado}}</v-list-item-title>
                    <v-list-item-title>Razon Social: {{pedidoAFacturar.datosPedido.razonSocial}}</v-list-item-title>
                    <v-list-item-title>CUIT: {{pedidoAFacturar.datosPedido.cuit}}</v-list-item-title>
                    <v-list-item-title>Forma de Pago: {{pedidoAFacturar.datosPedido.formaPago}}</v-list-item-title>
                    <v-list-item-title>Forma de Entrega: {{pedidoAFacturar.datosPedido.formaEntrega}}</v-list-item-title>
                    <v-list-item-title>Fecha Estimada de Entrega: {{pedidoAFacturar.datosPedido.fechaEntrega}}</v-list-item-title>
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
                        v-for="item in pedidoAFacturar.productos"
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
            <v-card-title>MONTO A FACTURAR: $ {{montoFactura}} </v-card-title>   
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="noFacturar()"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="green darken-1"
            @click="facturarOrden()"
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
import { mapState } from 'vuex'
const BaseURL = 'http://localhost:3000/pedidos'

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
            {
                text:'MONTO (US$)',
                value:'monto'
            },
            {
                text:'ESTADO',
                value:'estado'
            },
            { text: 'FACTURAR', value: 'actions', sortable: false },
        ],
        usuarioRegistrado: '',
        mensaje:'',
        snackbar:false,
        nombreContacto: '',
        colorSnackBar: '',
        dialog: false,
        pedidoAFacturar: '',
        fechaActual: null,
        montoFactura: 0
    }
},
created(){
    window.setInterval(() => {
        this.snackbar = false
    }, 3000)
},
computed:{
...mapState(['user'])
},
watch:{
    user(newValue){
        this.usuarioRegistrado = newValue
    }
},
mounted(){
    axios.get(BaseURL).then(res => {
        this.pedidos = res.data
    })
    this.usuarioRegistrado = this.$store.state.user
    var f = new Date();
    this.fechaActual = (f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear());
},
methods:{
    cargarOrden(item){
        this.pedidoAFacturar = item
        this.dialog = true
        this.montoFactura = this.pedidoAFacturar.monto*1.21
    },
    noFacturar(){
        this.dialog = false
        this.pedidoAFacturar = ''
        this.montoFactura = 0
    },
    async facturarOrden(){
        //CARGA LA FACTURA AL SERVIDOR
        if(this.pedidoAFacturar){
            var factura = {
                fecha: this.fechaActual,
                datosCliente: {
                    cliente: this.pedidoAFacturar.datosPedido.razonSocial,
                    MailCliente: this.pedidoAFacturar.datosPedido.usuarioRegistrado,
                    CUIT: this.pedidoAFacturar.datosPedido.cuit,
                    nombreContacto: this.pedidoAFacturar.datosPedido.nombreContacto
                },
                formaDePago: this.pedidoAFacturar.datosPedido.formaPago,
                monto: this.montoFactura,
                productos: this.pedidoAFacturar.productos,
                usuarioFacturante: this.usuarioRegistrado
            }
            await axios.post('http://localhost:3000/facturas',factura).then(res =>{
                if(res.status === 201 || res.status === 200){
                    this.mensaje = "SE HA FACTURADO CON EXITO"
                    this.colorSnackBar = 'success'
                    this.snackbar = true
                    this.dialog = false
                }else{
                    this.dialog = false
                    this.mensaje = "SE PRODUJO UN ERROR EN EL PROCESO DE FACTURACION, INTENTE NUEVAMENTE"
                    this.colorSnackBar = 'error'
                    this.snackbar = true
                }
            }).then(()=>{ 
                // CAMBIA LA CONDICION DE ACEPTADO A FACTURADO
                axios.put(BaseURL+`/${this.pedidoAFacturar.id}`,{      
                    datosPedido: this.pedidoAFacturar.datosPedido,
                    productos: this.pedidoAFacturar.productos,
                    monto: this.pedidoAFacturar.monto,
                    estado: 'FACTURADO',
                    solicitud:'PEDIDO'})
                }).then( ()=>{
                // ACTUALIZA LA LISTA DE PEDIDOS
                axios.get(BaseURL).then(res => {
                    this.pedidos = res.data
                })
            }).then( ()=> {
                //SE DESCUENTAN LOS STOCKS CORRESPONDIENTES
                this.pedidoAFacturar.productos.forEach(element => {
                    axios.put(`http://localhost:3000/productos/${element.id}`,{
                        NOMBRE:element.NOMBRE,
                        CATEGORIA:element.CATEGORIA,
                        PRECIO:element.PRECIO,
                        PROVEEDOR:element.PROVEEDOR,
                        CANTIDAD: (element.CANTIDADDISPONIBLE-element.CANTIDADSOLICITADA)
                    })
                });
            })
        }
    },
}
}
</script>

<style>

</style>