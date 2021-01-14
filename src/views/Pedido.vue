<template>
    <v-card>
        <BannerPedido />
        <TablaProductosPedido/>

        <v-btn
        dark
        color="success"
        x-large
        @click="confirmarPedido"
        style="float:right"
        >
            Confirmar Pedido
        </v-btn>
        <v-alert type="error" v-if="errorPedido" v-model="errorPedido" dismissible>{{mensajeError}}</v-alert>
        <v-alert type="success" v-if="succesPedido">PEDIDO GUARDADO CON EXITO, LO ESTAREMOS CONTACTANDO A LA BREVEDAD</v-alert>
    </v-card>
</template>

<script>
import BannerPedido from '@/components/BannerPedido.vue'
import TablaProductosPedido from '@/components/TablaProductosPedido.vue'
import axios from 'axios'
import {mapState} from 'vuex'

const BaseURL = 'http://localhost:3000/pedidos'
export default {
    data(){
        return{
            errorPedido:false,
            succesPedido:false,
            mensajeError:'',
            productos: [],
            datosPedido: '',
            nroPedido: '',
        }
    },
    components:{
        BannerPedido,
        TablaProductosPedido
    },
    mounted(){
        axios.get(BaseURL).then(res => { this.nroPedido = res.data.length+1})
        this.productos = this.$store.state.productosPedido
        this.datosPedido = this.$store.state.datosPedidoNuevo
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
        async confirmarPedido(){
            var pedidoNuevo = {
                id: this.nroPedido,
                datosPedido: this.datosPedido,
                productos: this.productos,
                estado: 'ACEPTADO',
                solicitud:'PEDIDO'
            }
            await axios.post(BaseURL,pedidoNuevo).then( res => {
                if(res.status === 201 || res.status === 200 ){
                    this.succesPedido = true
                    pedidoNuevo = {}
                    this.$store.state.esPedido = false
                }else{
                    this.mensajeError = "ERROR AL CARGAR PEDIDO, POR FAVOR INTENTE NUEVAMENTE"
                    this.errorPedido = !this.errorPedido
                    throw res
                }
            }).then( ()=> {
                // routeo
                this.$router.push('/pedidos')
            })
        }
    },
}
</script>

<style>

</style>