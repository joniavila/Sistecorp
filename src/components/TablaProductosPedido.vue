<template>
    <v-data-table :headers="headers" :items="productosAgregados" class="elevation-1"
    :footer-props="{'items-per-page-text':'Productos por pagina'}"
    no-data-text = 'NO HA CARGADO NINGUN PRODUCTO'>
        <v-toolbar flat>
            <v-toolbar-title>PRODUCTOS</v-toolbar-title>
        </v-toolbar>
        <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="deleteItem(item)" >
            mdi-delete
        </v-icon>
        </template>
        <template v-slot:footer >
            <div style="text-align:center">Total Pedido: 
                $ {{totalPedido}}+IVA</div>
        </template>
    </v-data-table>
</template>

<script>
import {mapState} from 'vuex'
export default {
data(){
    return{
        productosAgregados:[],
        headers:[
                {
                    text:'ID',
                    value:'id'
                },
                {
                    text:'NOMBRE',
                    align: 'left',
                    sortable: false,
                    value: 'NOMBRE'
                },
                {
                    text:'CATEGORIA',
                    value:'CATEGORIA'
                },
                {
                    text:'CANTIDAD',
                    value:'CANTIDADSOLICITADA'
                },
                {
                    text:'PRECIO',
                    value:'PRECIO'
                },
                { text: '', value: 'actions', sortable: false },
            ],
            esPedidoWeb:false,
            totalPedido: 0,
    }
},
computed:{
    ...mapState(['productosPedido','esPedido'])
},
watch:{
    productosPedido(newValue){
        this.productosAgregados = newValue
    },
    esPedido(newValue){
        this.esPedidoWeb = newValue
    }
},
mounted(){
    this.esPedidoWeb = this.$store.state.esPedido
    this.productosAgregados = this.$store.state.productosPedido
    this.productosAgregados.forEach(e => {
        this.totalPedido += (parseInt(e.PRECIO)*parseInt(e.CANTIDADSOLICITADA))
    })
},
methods:{
    deleteItem(item){
        var indexItem = this.productosAgregados.indexOf(item)
        this.productosAgregados.splice(indexItem,1)
    },
}
}
</script>

<style>

</style>