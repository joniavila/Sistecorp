<template>
<div>

  <v-card>
    <v-card-title style="color:#6aaaff">
      PRODUCTOS DISPONIBLES
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
        :single-select="true"
        :items="productos"
        :search="search"
        no-data-text = 'NO HA CARGADO NINGUN PRODUCTO'
        :items-per-page="5"
    >
    <template v-slot:footer>
    <v-btn
        color="success"
        style="width:100%"
        @click="mostrarDialog()"
        :disabled="selected.length < 1">
            AGREGAR PRODUCTO
    </v-btn>
    </template>
    </v-data-table>
  </v-card>
  <!-- DIALOG PARA INGRESAR LA CANTIDAD -->
    <v-dialog
      v-model="agregar"
      persistent
      max-width="450"
      dark
    >
      <v-card>
        <v-card-title >
          Desea agregar este producto a su pedido?
        </v-card-title>
        <v-card-text> 
          <v-text-field v-model="cantidad" height="30" style="width:350px;" label="Ingrese Cantidad" required/>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            @click="hideDialog()"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            @click="agregarProducto()"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert type="warning" v-if="productoExistente" v-model="productoExistente" dismissible>EL PRODUCTO YA SE ENCUENTRA AGREGADO</v-alert>
</div>
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
                sortable: true,
                value: 'NOMBRE'
            },
            {
                text:'CATEGORIA',
                value:'CATEGORIA'
            },
            {
                text:'CANTIDAD DISPONIBLE',
                value:'CANTIDAD'
            },
            {
                text:'PRECIO',
                value:'PRECIO'
            },
        ],
        agregar: false,
        cantidad: '',
        productoExistente:false
    }
},
props:{
    categoria: String
},
computed:{
    ...mapState(['productosCotizacion','dialogCotizacion'])
},
created(){
    axios.get(baseURL+`?q=${this.categoria}`).then(res => { 
        if(res.status === 200){
            this.productos = res.data
        }
    })
},
mounted(){
},
methods:{ 
    mostrarDialog(){
        this.agregar = true
    },
    hideDialog(){
        this.agregar = false
        this.cantidad = ''
    },
    agregarProducto(){

        var id = this.selected[0].id
        var res = false
        //verificar si ese producto no se encuentra agregado
        this.$store.state.productosCotizacion.forEach( e => { 
            if(parseInt(e.id) == parseInt(id)){
                res = true
            }
        })
        if(!res){
            this.$store.state.dialogCotizacion = false
            this.$store.state.montoCotizacion += (parseInt(this.selected[0].PRECIO)*parseInt(this.cantidad))
            this.$store.state.productosCotizacion.push({
                id:this.selected[0].id,
                NOMBRE:this.selected[0].NOMBRE,
                CATEGORIA:this.selected[0].CATEGORIA,
                CANTIDADDISPONIBLE:this.selected[0].CANTIDAD,
                CANTIDADSOLICITADA:this.cantidad,
                PRECIO: this.selected[0].PRECIO,
                PROVEEDOR:this.selected[0].PROVEEDOR
            })
            this.selected = []
            this.cantidad = ''
            this.agregar = false
        }else{
            this.productoExistente= true
            this.agregar = false
            this.cantidad = ''
            this.selected = []
        }
    }
}
}
</script>

<style>

</style>