<template>
<v-card>
<BannerPedido />
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
    }
},
mounted(){
    axios.get(BaseURL).then(res => { this.nroPedido = res.data.length})
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
    async confirmarPedido(){
        var pedidoNuevo = {
            id: this.nroPedido,
            datosPedido: this.datosPedido,
            productos: this.productos
        }
        await axios.post(BaseURL,pedidoNuevo).then( res => {
            if(res.status === 200){
                // el status no es 200 
                // ver como hacer para el que formPedido no salga en rojo cada vez que agrega un nuevo producto
                // el alert deberia ser tipo toast
                alert('PEDIDO REGISTRADO CON EXITO')
                pedidoNuevo = {}
            }else{
                alert(res)
            }
        })
    }
}
}
</script>

<style>

</style>