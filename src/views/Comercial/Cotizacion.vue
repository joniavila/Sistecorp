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
<v-alert type="error" v-if="errorPedido" v-model="errorPedido" dismissible>{{mensajeError}}</v-alert>
<v-alert type="success" v-if="succesPedido">PEDIDO GUARDADO CON EXITO, LO ESTAREMOS CONTACTANDO A LA BREVEDAD</v-alert>
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
        errorPedido:false,
        succesPedido:false,
        mensajeError: null,
        modal:false,
        observaciones:''
    }
},
mounted(){
    axios.get(BaseURL).then(res => { this.nroPedido = res.data.length+1})
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
        await axios.post(BaseURL,pedidoNuevo).then( res => {
            if(res.status === 201 || res.status === 200 ){
                this.succesPedido = true
                pedidoNuevo = {}
                // routeo
                window.setInterval(() => {
                    this.$router.push('/pedidos')
                }, 4000)
            }else{
                this.mensajeError = "ERROR AL CARGAR PEDIDO, POR FAVOR INTENTE NUEVAMENTE"
                this.errorPedido = !this.errorPedido
                throw res
            }
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