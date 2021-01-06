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
                    text:'FORMA PAGO',
                    value:'CATEGORIA'
                },
                {
                    text:'CANTIDAD',
                    value:'CANTIDAD'
                },
                { text: '', value: 'actions', sortable: false },
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
},
mounted(){
    this.productosAgregados = []
},
methods:{
    deleteItem(item){
        var indexItem = this.productosAgregados.indexOf(item)
        this.productosAgregados.splice(indexItem,1)
    }
}
}
</script>

<style>

</style>