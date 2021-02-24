<template>
<div>
    <!-- CARRITO DE COMPRAS  -->
  <v-speed-dial
      style="margin-left:50%"
      direction="top"
      :open-on-hover="true"
      transition="slide-y-transition"
      origin="0px 0px"
      fixed
      bottom
      left
      :draggable="true"
    >
      <template v-slot:activator>
          <v-btn class="primary lighten-1"
            fab>
            <v-icon>
              mdi-cart-variant 
            </v-icon>
            ({{productosSeleccionados.length}})
          </v-btn>
      </template>
          <v-list color="primary lighten-1">
            <v-list-item v-for="(prod,o) in productosSeleccionados" :key="o" dense>
              <v-list-item-title >
                {{prod.NOMBRE}} [Cantidad:{{prod.CANTIDADSOLICITADA}}]
              </v-list-item-title>
              <v-icon @click="eliminarProductoCarrito(prod)"
              dark >mdi-delete</v-icon>
            </v-list-item>
          </v-list>
  </v-speed-dial>
  <!-- SECCION CATEGORIAS  -->
  <v-card dark>
    <v-row justify="space-around" >
    <v-col cols="12" sm="10" md="8" >
      <v-sheet elevation="10" class="py-4 px-12">
        <h3 style="text-align: center;">SELECCIONE LA CATEGRORIA</h3>
        <v-chip-group
          mandatory
          active-class="primary--text"
          :center-active="true"
          style="justify-content: center;"
        >
          <v-chip
            v-for="cat in categoriasProductos"
            :key="cat"
            @click="cambiarCategoria(cat)"
          >
            {{ cat }}
          </v-chip>
        </v-chip-group>
      </v-sheet>
      <!-- FILTRO PARA BUSQUEDA -->
    </v-col>
      <div style="align-self: center;">
      <v-menu offset-y >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          SELECCIONE UN FILTRO
        </v-btn>
      </template>
      <v-list dark>
        <v-list-item
          v-for="(item, index) in filtros"
          :key="index"
        >
        <v-list-item-title>
          <v-btn @click="cambiarFiltro(item)"
            text
            rounded>{{item}}</v-btn>
        </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <template style="">
        <div style="display: flex;margin-top:12px">
        <v-text-field v-model="busqueda" height="20" label="BUSCAR POR NOMBRE" />
        <v-btn
        color="primary"
        style="margin-left:3px"
        @click="buscarPorNombre(busqueda)">
            <v-icon small>mdi-magnify</v-icon>
        </v-btn>
        </div>
    </template>

    </div>
  </v-row>

  </v-card>
  <v-divider/>
    <v-progress-circular
        v-if="cargando"
        :size="70"
        :width="7"
        color="primary"
        :indeterminate="cargando"
        style="margin-left:50%"
    ></v-progress-circular>
    <div>  
      <v-row dense>
          <v-col v-for="prod in productosVisibles" :key="prod.id" cols="3">
            <v-card class="mx-auto" max-width="344" min-height="230" outlined>
                <v-list-item three-line>
                <v-list-item-content>
                    <div class="overline mb-4">
                    {{prod.CATEGORIA}}
                    </div>
                    <v-list-item-title class="headline mb-1">
                    {{prod.NOMBRE}}
                    </v-list-item-title>
                    <v-list-item-title class="headline mb-1">
                    ${{prod.PRECIO}}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{prod.NOMBRE}} 
                    </v-list-item-subtitle>
                    <v-list-item-subtitle>
                       Stock: {{prod.CANTIDAD}}
                    </v-list-item-subtitle>
                </v-list-item-content>

                <!-- ACA IRIA LA IMAGEN -->
                <v-list-item-avatar
                    tile
                    size="80"
                    color="grey"
                >
                </v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                <v-btn outlined rounded text @click="mostrarDialog(prod)">
                    Agregar
                </v-btn>
                </v-card-actions>
            </v-card>
          </v-col>
      </v-row>
      <div class="text-center" v-if="listaProducto.length >0">
          <v-pagination v-model="page" :length="Math.ceil(listaProducto.length/perPage)"></v-pagination>
          <v-btn color="success" style="float:right" x-large @click="finalizarPedido()">CONFIRMAR({{productosSeleccionados.length}})</v-btn>
      </div>
    </div>
          <v-alert type="warning" style="text-align:center" v-if="productosFaltantes" v-model="productosFaltantes" dismissible>DEBE AGREGAR UN PRODUCTO A SU PEDIDO!</v-alert>
    <!-- DIALOG PARA AGREGAR PRODUCTOS -->
    <v-row justify="center">
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
          <v-text-field v-model="cantidad" height="30" style="width:350px;" label="Ingrese Cantidad" :rules="[v=> v>0 || 'Debe ser mayor que 0']" required/>
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
            :disabled="!cantidad"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-alert type="warning" v-if="cantidadSuperada" v-model="cantidadSuperada" dismissible>NO DISPONEMOS DE ESA CANTIDAD EN ESTOS MOMENTOS</v-alert>
    </v-dialog>
  </v-row>
</div>
</template>

<script>
import {mapState} from 'vuex'
import axios from 'axios'
const baseURL = 'http://localhost:3000/productos'
const BaseURL2 = 'http://localhost:3000/pedidos'

export default {
data(){
    return{
        categoriasProductos: this.$store.state.categorias,
        listaProducto: [],
        productosSeleccionados:[],
        page:1,
        perPage:12,
        cargando: false,
        filtros:['PRECIO (ASCENDENTE)','PRECIO (DESCENDENTE)','STOCK'],
        busqueda: '',
        categoriaSeleccionada: '',
        cantidadDeProducto: '',
        agregar:false,
        cantidad: '',
        productoAagregar:'',
        nroPedido: '',
        id: 0,
        cantidadSuperada: false,
        productosFaltantes: false
    }
},
mounted(){
    this.categoriaSeleccionada = 'MICRO'
    axios.get(`${baseURL}?q=MICRO`).then(res => {
        if(res.status===200){
            this.listaProducto = res.data
            this.cargando = false
    }})
    axios.get(BaseURL2+`?_sort=id&_order=desc`).then(res => { this.nroPedido = res.data[0].id+1})
},
computed:{
  ...mapState(['categorias','productosPedido','esPedido']),
  productosVisibles(){
  return this.listaProducto.slice((this.page-1)*this.perPage, this.page*this.perPage)
  }
},
watch:{
    categorias(newValue){
        this.categoriasProductos = newValue
    },
    productosPedido(newValue){
      this.productosSeleccionados = newValue
    }
},
methods:{
    async cambiarCategoria(categoria){
        this.categoriaSeleccionada = categoria
        this.cargando = true
        this.listaProducto = []
        this.busqueda= ''
        try {
            await axios.get(`${baseURL}?q=${categoria}`).then(res => {
                if(res.status===200){
                    this.listaProducto = res.data
                    this.cargando = false
                }
            })
        } catch (error) {
            throw error
        }
    },
    hideDialog(){
      this.agregar = false
      this.cantidad = ''
      this.productoAagregar = ''
    },
    mostrarDialog(item){
        this.agregar = true
        this.productoAagregar = item
    },
    cambiarFiltro(item){
        if(item === 'PRECIO (ASCENDENTE)'){
            this.listaProducto.sort((a, b) => parseFloat(a.PRECIO) - parseFloat(b.PRECIO));
        }
        if(item === 'PRECIO (DESCENDENTE)'){
            this.listaProducto.sort((a, b) => parseFloat(b.PRECIO) - parseFloat(a.PRECIO));
        }
        if(item === 'STOCK'){
            this.listaProducto.sort((a, b) => parseFloat(a.CANTIDAD) - parseFloat(b.CANTIDAD));
        } 
    },
    buscarPorNombre(busqueda){
        if(busqueda != ''){
            this.listaProducto = this.listaProducto.filter(e => {
                return e.NOMBRE.includes(busqueda.toUpperCase())
            })
        }else{
            this.cambiarCategoria(this.categoriaSeleccionada)
        }
    },
    agregarProducto(){
      //AGREGAMOS EL PRODUCTO A UNA LISTA DE LA VISTA Y AL STORE
      if(this.cantidad < parseInt(this.productoAagregar.CANTIDAD)){
      this.agregar = false
      this.productosFaltantes = false
      // this.productosSeleccionados.push(this.productoAagregar)
      this.$store.state.productosPedido.push({
        id:this.productoAagregar.id,
        NOMBRE:this.productoAagregar.NOMBRE,
        CATEGORIA:this.productoAagregar.CATEGORIA,
        CANTIDADDISPONIBLE:this.productoAagregar.CANTIDAD,
        CANTIDADSOLICITADA:this.cantidad,
        PRECIO: this.productoAagregar.PRECIO,
        PROVEEDOR:this.productoAagregar.PROVEEDOR
      })
      this.cantidad = ''
      this.productoAagregar = ''
      }else{
        this.cantidadSuperada = true
        this.cantidad = ''
        window.setInterval(() => {
            this.cantidadSuperada = false
        }, 3000)
      }
    },
    finalizarPedido(){
      if(this.productosSeleccionados.length > 0){
        this.$store.state.esPedido = true
        this.$router.push('/infoPedido&cotizacion')
      }else{
        this.productosFaltantes = true
      }
    },
    eliminarProductoCarrito(item){
      var indexItem = this.productosSeleccionados.indexOf(item)
      this.productosSeleccionados.splice(indexItem,1)
    }
},
}
</script>

<style>

</style>