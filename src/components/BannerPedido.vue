<template>
  <v-card dark>
    <v-list-item>
      <v-list-item-content style="color:#6aaaff">
        <v-list-item-title>Fecha de Pedido: {{ datosPedido.fecha }}</v-list-item-title>
        <v-list-item-title>Fecha de entrega: {{ datosPedido.fechaEntrega }}</v-list-item-title>
      </v-list-item-content>
      <div v-if="!pedidoWeb">  
      <v-list-item-content style="color:#6aaaff">
        <v-list-item-title>Nombre del contacto: {{ datosPedido.nombreContacto }}</v-list-item-title>
        <v-list-item-title>Mail del contacto: {{ datosPedido.mailContacto }}</v-list-item-title>
      </v-list-item-content>
      </div>
      <v-list-item-content style="color:#6aaaff">
        <v-list-item-title>Forma de Pago: {{ datosPedido.formaPago }}</v-list-item-title>
        <v-list-item-title>Metodo de envio: {{ datosPedido.formaEntrega }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
      <v-btn depressed
        color="success"
        @click="modificarPedido"
        small
      >
        Modificar
      </v-btn>
      <!-- DEBERIA AGREGAR UN BOTON PARA OCULTAR EL BANNER -->
  </v-card>
</template>

<script>
import {mapState} from 'vuex'
export default {
data(){
    return{
      datosPedido: this.$store.state.datosPedidoNuevo,
      pedidoWeb: false
    }
},
computed:{
    ...mapState(['datosPedidoNuevo','esPedido'])
},
watch:{
    datosPedidoNuevo(newValue){
        this.datosPedido = newValue
    },
    esPedido(newValue){
      this.pedidoWeb = newValue
    }
},
methods:{
    modificarPedido(){
        this.$router.push('/infoPedido&cotizacion')
    }
}
}
</script>