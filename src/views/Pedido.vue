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
<TablaProductosPedido style="width:50%;float:right"/>
<v-btn
    dark
    color="success"
    x-large
    @click="confirmarPedido"
    style="float:right"
    >
        Confirmar Pedido
</v-btn>
</div>
<v-alert type="error" v-if="errorPedido" v-model="errorPedido" dismissible>{{mensajeError}}</v-alert>
<v-alert type="success" v-if="succesPedido">PEDIDO GUARDADO CON EXITO, LO ESTAREMOS CONTACTANDO A LA BREVEDAD</v-alert>
</v-card>
</template>

<script>
import BannerPedido from '@/components/BannerPedido'
import TablaProductosPedido from '@/components/TablaProductosPedido'
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
        mensajeError: null
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
    TablaProductosPedido,
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
    }
},
methods:{
    ocultarBanner(){
        this.mostrarBanner = !this.mostrarBanner
    },
    async confirmarPedido(){
        if(this.productos.length > 0){
            var pedidoNuevo = {
                id: this.nroPedido,
                datosPedido: this.datosPedido,
                productos: this.productos,
                estado: 'PENDIENTE'
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
        }else{
            this.mensajeError = "DEBE INGRESAR PRODUCTOS PARA HACER EL PEDIDO"
            this.errorPedido = true
        }
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