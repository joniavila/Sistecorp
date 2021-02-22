<template>
<v-card>
<BannerPedido v-if="mostrarBanner"/>
<v-btn
    small
    v-if="mostrarBanner"
    @click="ocultarBanner"
    >
    Ocultar Datos Pedido
</v-btn>
<v-btn
    small
    v-if="!mostrarBanner"
    @click="ocultarBanner"
    >
        Mostrar Datos Pedido
</v-btn>
<div>
<FormPedido style="width:50%;float:left"/>
<TablaProductosCotizacion style="width:50%;float:right"/>
<v-btn
    dark
    color="success"
    x-large
    @click="modal=true"
    style="float:right"
    :disabled="this.productos.length===0"
    >
        Confirmar Pedido
</v-btn>
</div>
<v-dialog v-model="modal"
    persistent
    max-width="500" dark>
    <v-card >
        <v-card-title>Esta seguro que desea crear este presupuesto?</v-card-title>
        <v-card-text>
              <v-container >
                <v-textarea
                    solo
                    name="input-7-4"
                    label="OBSERVACIONES"
                    v-model="observaciones"
                ></v-textarea>
              </v-container>
        </v-card-text>
        <v-card-actions style="margin-left:30%">
            <v-btn color="success" @click="confirmarPedido">
                ACEPTAR
            </v-btn>
            <v-btn color="error" @click="modal=false">
                CANCELAR
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
<v-snackbar v-model="snackbar" :timeout="2000" centered :color="colorSnackBar">
    {{mensaje}}
</v-snackbar>

</v-card>
</template>

<script>
import BannerPedido from '@/components/BannerPedido'
import TablaProductosCotizacion from '@/components/TablaProductosCotizacion'
import FormPedido from '@/components/FormPedido'
import axios from 'axios'
import {mapState} from 'vuex'

const BaseURL = 'http://localhost:3000/pedidos'

export default {
data(){
    return{
        datosPedido: this.$store.state.datosPedidoNuevo,
        productos:[],
        nroPedido: '',
        mostrarBanner:true,
        modal:false,
        observaciones:'',
        snackbar: false,
        colorSnackBar: '',
        mensaje:''
    }
},
mounted(){
    axios.get(BaseURL+`?_sort=id&_order=desc`).then(res => { this.nroPedido = res.data[0].id+1})
    if(this.errorPedido){
        this.hide_alert();
    }
},
components:{
    BannerPedido,
    TablaProductosCotizacion,
    FormPedido
},
computed:{
    ...mapState(['datosPedidoNuevo','productosPedido'])
},
watch:{
    datosPedidoNuevo(newValue){
        this.datosPedido = newValue
    },
    productosPedido(newValue){
        this.productos = newValue
    },
},
methods:{
    ocultarBanner(){
        this.mostrarBanner = !this.mostrarBanner
    },
    async confirmarPedido(){
        this.modal= false
        var pedidoNuevo = {
            id: this.nroPedido,
            datosPedido: this.datosPedido,
            productos: this.productos,
            monto:'SIN COTIZAR',
            estado: 'PENDIENTE',
            solicitud:'COTIZACION',
            observaciones: this.observaciones
        }
        await axios.post(BaseURL,pedidoNuevo).then( response => {
            if(response.status === 201 || response.status === 200 ){
                this.snackbar= true,
                this.colorSnackBar= 'success',
                this.mensaje='PEDIDO DE COTIZACION CARGADO CON EXITO'  
                pedidoNuevo = {}
            }else{
                this.snackbar= true,
                this.colorSnackBar= 'error',
                this.mensaje='HUBO UN ERROR AL CARGAR EL PEDIDO DE COTIZACION, INTENTE NUEVAMENTE LUEGO'  
            }
        }).then(()=>{
            // routeo
            this.$router.push('/pedidos')
           
        })
    },
    hide_alert() {
        window.setInterval(() => {
            this.succesPedido = false
            this.errorPedido = false
        }, 3000)
    }
}
}
</script>

<style>

</style>