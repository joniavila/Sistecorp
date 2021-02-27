<template>
<div>
    <h2>{{pedido.solicitud}} NRO {{ pedido.id}}</h2>
<!-- PRODUCTOS SOLICITADOS -->
<v-card >
    <v-card-text>
            <v-data-table :headers="headers" :items="pedido.productos" class="elevation-1"
            :footer-props="{'items-per-page-text':'Productos por pagina'}"
            no-data-text = 'NO EXISTEN PRODUCTOS CARGADOS EN ESTA COTIZACION' dense>
            <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>PRODUCTOS SOLICITADOS</v-toolbar-title>
            </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
            <v-icon @click="cotizar(item)" >mdi-magnify</v-icon>
            </template>
            </v-data-table>
    </v-card-text>
</v-card>
    <!-- PRODUCTOS COTIZADOS -->
    <v-card dark>
            <v-card-text>
           <v-data-table :headers="headers2" :items="productosCotizacion" class="elevation-1"
            :footer-props="{'items-per-page-text':'Productos por pagina'}"
            no-data-text = 'NO AGREGO NINGUN PRODUCTO A LA COTIZACION'
            dense>
            <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>PRODUCTOS COTIZADOS</v-toolbar-title>
            </v-toolbar>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
            <v-icon @click="deleteItem(item)">mdi-delete</v-icon>
            </template>
            </v-data-table>
            </v-card-text>
            <v-card-title>EL MONTO COTIZADO ES: ${{monto}}</v-card-title>
    </v-card>
    
      <v-dialog
    v-model="dialog"
      persistent
      max-width="900"
      height="400"
      dark>
      <TablaSeleccionProductosCotizacion :categoria="categoriaBusqueda"/>
      </v-dialog>
      <div style="float:right;margin:5px">
      <v-btn color="success" 
      @click="finalizarCotizacion()"
      x-large
      :disabled="productosCotizados.length <= 0"
      >ACEPTAR</v-btn>
      </div>
        <v-snackbar v-model="snackbar" :timeout="2000" centered :color="colorSnackBar">
              {{mensaje}}
        </v-snackbar>
</div>
</template>

<script>
import TablaSeleccionProductosCotizacion from '../../../components/TablaSeleccionProductosCotizacion'
import {mapState} from 'vuex'
import axios from 'axios'
const BaseURL = 'http://localhost:3000/pedidos'

export default {
data(){
    return{
        pedido:{},
        headers:[
            {text:'PRODUCTO',value:'NOMBRE'},
            {text:'CANTIDAD',value:'CANTIDAD'},
            {text:'CATEGORIA',value:'CATEGORIA'},
            { text: 'COTIZAR', value: 'actions', sortable: false },
        ],
        headers2:[
            {text:'PRODUCTO',value:'NOMBRE'},
            {text:'CANTIDAD AGREGADA',value:'CANTIDADSOLICITADA'},
            {text:'CATEGORIA',value:'CATEGORIA'},
            {text:'PRECIO',value:'PRECIO'},
            { text: 'ELIMINAR', value: 'actions', sortable: false },
        ],
        productosCotizados:[],
        dialog:false,
        categoriaBusqueda: '',
        monto:0,
        snackbar: false,
        colorSnackBar: '',
        mensaje: ''
    }
},
mounted(){
    this.pedido = this.$store.state.pedidoAcotizar
},
components:{
    TablaSeleccionProductosCotizacion
},
methods:{
    cotizar(item){
        this.dialog = true
        this.$store.state.dialogCotizacion = true
        this.categoriaBusqueda= item.CATEGORIA
    },
    deleteItem(item){
        var indexItem = this.productosCotizados.indexOf(item)
        this.$store.state.montoCotizacion -= parseInt(this.productosCotizados[indexItem].PRECIO)*parseInt(this.productosCotizados[indexItem].CANTIDADSOLICITADA)
        this.productosCotizados.splice(indexItem,1)
    },
    async finalizarCotizacion(){
        var pedidoCotizado ={
            estado :'COTIZADO',
            datosPedido: this.pedido.datosPedido,
            productos: this.pedido.productos,
            productosCotizados: this.productosCotizados,
            monto: this.monto,
            solicitud: 'COTIZACION'
        }

        await axios.put(BaseURL+`/${this.pedido.id}`,pedidoCotizado).then(res => {
            if(res.status === 200){
                this.mensaje = "EL PEDIDO SE HA COTIZADO CON EXITO"
                this.colorSnackBar = 'success'
                this.snackbar = true
                pedidoCotizado = {}
            }else{
                this.mensaje = "HUBO UN ERROR AL CARGAR SU COTIZACION, INTENTE NUEVAMENTE"
                this.colorSnackBar = 'red'
                this.snackbar = true
            }
        }).then( () => {
         // ver si habria que rutear a otra pantalla
         this.$router.push('/historialCotizaciones')
        })
    }
},
computed:{
...mapState(['productosCotizacion','dialogCotizacion','pedidoAcotizar','montoCotizacion'])
},
watch:{
    productosCotizacion(newValue){
        this.productosCotizados = newValue
    },
    dialogCotizacion(newValue){
        this.dialog = newValue
    },
    montoCotizacion(newValue){
        this.monto = newValue
    }
}
}
</script>

<style>

</style>