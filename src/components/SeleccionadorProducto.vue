<template>
  <v-card dark>
    <h3>Datos del pedido</h3> 
    <v-list-item>
      <v-list-item-content style="color:#6aaaff">
        <v-list-item-title>Fecha de Pedido: {{ datosPedido.fecha }}</v-list-item-title>
        <v-list-item-title>Fecha de entrega: {{ datosPedido.fechaEntrega }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-content style="color:#6aaaff">
        <v-list-item-title>Nombre del contacto: {{ datosPedido.nombreContacto }}</v-list-item-title>
        <v-list-item-title>Mail del contacto: {{ datosPedido.mailContacto }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-content style="color:#6aaaff">
        <v-list-item-title>Forma de Pago: {{ datosPedido.formaPago }}</v-list-item-title>
        <v-list-item-title>Metodo de envio: {{ datosPedido.formaEntrega }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
      <v-btn
        text
        color="primary"
        @click="modificarPedido"
      >
        Modificar
      </v-btn>
  </v-card>
</template>

<script>
import {mapState} from 'vuex'
export default {
data(){
    return{
      datosPedido: this.$store.state.datosPedidoNuevo
    }
},
computed:{
    ...mapState(['datosPedidoNuevo'])
},
watch:{
    datosPedidoNuevo(newValue){
        this.datosPedido = newValue
    }
},
methods:{
    modificarPedido(){
        this.$router.push('/pedido')
    }
}
}
</script>