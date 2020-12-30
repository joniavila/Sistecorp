<template>
<v-card style="height:auto">
  <v-form 
    ref="form"
    v-model="valid"
    lazy-validation
  >
  <v-col cols="12" sm="6" md="6">
    <v-text-field
      v-model="nombreProducto"
      label="Nombre Producto"
      required
      dense
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="6" md="6">
    <v-text-field
      v-model="cantidad"
      label="Cantidad"
      required
      dense
    ></v-text-field>
  </v-col>

  <v-col cols="12" sm="6" md="6">
    <v-select
      v-model="categoria"
      :items="categorias"
      :rules="[v => !!v || 'Seleccione una categoria']"
      label="categoria"
      required
      offset-y
    ></v-select>
  </v-col>
  <v-col cols="12" sm="6" md="6">
    <v-checkbox
      v-model="checkbox"
      label="Acepto marca o producto similar?"
    ></v-checkbox>
  </v-col>
  <v-alert type="error" v-if="error">INGRESE UN NOMBRE DE PRODUCTO O CANTIDAD NECESARIA</v-alert>
  </v-form>
    <v-btn
      :disabled="!valid"
      color="primary"
      class="mr-4"
      @click="cargarProducto"
    >
      Agregar Producto
    </v-btn>
</v-card>
</template>

<script>
import {mapState} from 'vuex'
// import axios from 'axios'
// const baseURL = 'http://localhost:3000/pedidos'

  export default {
    data: () => ({
      nombreProducto:'',
      valid: true,
      cantidad: '',
      categoria: null,
      categoriasProductos: '',
      checkbox: false,
      id:0,
      productosNuevos:[],
      error: false
    }),
    mounted(){
      this.id = 0
      if(alert){
        this.hide_alert();
      }
    },
    computed:{
    ...mapState(['categorias'])
    },
    watch:{
        categorias(newValue){
            this.categoriasProductos = newValue
        }
    },
    methods: {
      async cargarProducto () {
        if(this.nombreProducto && this.cantidad){
          this.id = this.$store.state.productosPedido.push({
            id:this.id,
            NOMBRE:this.nombreProducto,
            CATEGORIA:this.categoria,
            CANTIDAD:this.cantidad,
          })
          this.nombreProducto= ''
          this.categoria= ''
          this.cantidad= ''
          this.checkbox= false
        }else{
          this.error = true
        }    
      },
      reset () {
        this.$refs.form.reset()
      },
      hide_alert() {
        window.setInterval(() => {
          this.error = false;
        }, 3000)}
      }
  }
</script>
