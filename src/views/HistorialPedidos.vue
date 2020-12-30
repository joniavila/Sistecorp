<template>
  <v-data-table :headers="headers" :items="pedidos" class="elevation-1"
    :footer-props="{'items-per-page-text':'Productos por pagina'}">
    <v-toolbar flat>
        <v-toolbar-title>PEDIDOS</v-toolbar-title>
    </v-toolbar>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small @click="deleteItem(item)" >
        mdi-delete
      </v-icon>
    </template>
    <v-alert :type="colorSnackBar" v-if="snackbar" v-model="snackbar" dismissible>{{mensaje}}</v-alert>
    </v-data-table>
</template>

<script>
import axios from 'axios'
const BaseURL = 'http://localhost:3000/pedidos'

export default {
    data(){
    return{
        pedidos:[],
        headers:[
            {
                text:'NRO PEDIDO',
                value:'id'
            },
            {
                text:'FECHA PEDIDO',
                align: 'left',
                sortable: false,
                value: 'datosPedido.fecha'
            },
            {
                text:'FORMA ENTREGA',
                value:'datosPedido.formaEntrega'
            },
            {
                text:'FORMA PAGO',
                value:'datosPedido.formaPago'
            },
            {
                text:'CANTIDAD PRODUCTOS',
                value:'productos.length'
            },
            {
                text:'ESTADO',
                value:'estado'
            },
            { text: '', value: 'actions', sortable: false },
        ],
        mensaje:'',
        snackbar:false,
        nombreContacto: ''
    }
},
mounted(){
    // http://localhost:3000/pedidos?q=Jonas%20Avila
    this.nombreContacto = localStorage.getItem('name').replace('"','').replace('"','')
    axios.get(BaseURL+`?q=${this.nombreContacto}`).then(res => {
        this.pedidos = res.data
    })
},
methods:{
    async deleteItem(item){
        await axios.delete(`http://localhost:3000/pedido/${item.id}`)
          .then(res => {
            if(res.status === 200){
              this.mensaje = "PEDIDO ELIMINADO CON EXITO"
              this.colorSnackBar = 'green'
              this.snackbar = true
            }else{
              this.mensaje = 'ERROR: EL PEDIDO NO SE ELIMINO, INTENTE NUEVAMENTE LUEGO'
              this.colorSnackBar = 'red'
              this.snackbar = true
            }
          }).then(()=>{
            axios.get(BaseURL+`?q=${this.nombreContacto}`).then(res => {
                this.pedidos = res.data
            })
          })
    }
}
}
</script>

<style>

</style>