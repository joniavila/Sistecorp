<template>
    <v-data-table :headers="headers" :items="productosAgregados" class="elevation-1"
    :footer-props="{'items-per-page-text':'Productos por pagina'}">
    <v-toolbar flat>
        <v-toolbar-title>PRODUCTOS</v-toolbar-title>
    </v-toolbar>
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
                    value:'CANTIDAD'
                },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
    }
},
computed:{
    ...mapState(['productosPedido'])
},
watch:{
    productosPedido(newValue){
        this.productosAgregados = newValue
    }
}
}
</script>

<style>

</style>