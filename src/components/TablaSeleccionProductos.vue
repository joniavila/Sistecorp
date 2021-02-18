<template>
  <v-card>
    <v-card-title>
      PRODUCTOS
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="mdi-magnify"
        label="BUSQUEDA"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
        show-select
        v-model="selected"
        :headers="headers"
        @item-selected="itemSelected"
        :items="productos"
        :search="search"
        no-data-text = 'NO HA CARGADO NINGUN PRODUCTO'
    >
    <template v-slot:footer>
    <!-- <v-btn
        color="success"
        style="width:100%"
        @click="$emit('close-dialog')">
            GUARDAR
        </v-btn> -->
    </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from 'axios'
const baseURL = 'http://localhost:3000/productos'
import {mapState} from 'vuex'

export default {
data(){
    return{
        search: '',
        singleSelect:false,
        selected:[],
        productos: [],
        headers: [
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
        ],
    }
},
computed:{
    ...mapState(['productosPreferencia'])
},
created(){
    axios.get(baseURL).then(res => { 
        if(res.status === 200){
            this.productos = res.data
        }
    })
},
mounted(){
},
methods:{ 
       itemSelected(prod){
           this.$store.state.productosPreferencia.push({
               id:prod.item.id,
               nombre:prod.item.NOMBRE}) 
       }
}
}
</script>

<style>

</style>