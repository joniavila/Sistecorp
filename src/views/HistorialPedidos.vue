<template>
<div>
  <v-data-table :headers="headers" :items="pedidos" class="elevation-1"
    :footer-props="{'items-per-page-text':'Pedidos por pagina'}"
    no-data-text = 'NO TIENE UN HISTORIAL DE PEDIDOS REGISTRADOS'>
    <template v-slot:top>
    <v-toolbar flat>
        <v-toolbar-title>PEDIDOS Y COTIZACIONES</v-toolbar-title>
    </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small @click="deleteItem(item)" >
        mdi-delete
      </v-icon>
    </template>
    </v-data-table>
    <v-alert :color="colorSnackBar" v-model="snackbar" :timeout="2000" centered dismissible>{{mensaje}}</v-alert>
</div>
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
        nombreContacto: '',
        colorSnackBar: ''
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
      try {
        await axios.delete(`${BaseURL}/${item.id}`).then(res => {
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
      } catch (error) {
        this.mensaje = 'ERROR: '+error
        this.colorSnackBar = 'red'
        this.snackbar = true
      }
    }
}
}
</script>

<style>

</style>