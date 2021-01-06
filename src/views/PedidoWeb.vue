<template>
<div>
  <v-card dark>
    <v-row justify="space-around">
    <v-col cols="12" sm="10" md="8">
      <v-sheet elevation="10" class="py-4 px-1">
    <h3 style="text-align: center;">SELECCIONE LA CATEGRORIA</h3>
        <v-chip-group
          mandatory
          active-class="primary--text"
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
          v-for="(item, index) in filros"
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
            <v-card class="mx-auto" max-width="344"  outlined>
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
                <v-btn outlined rounded text @click="agregarProducto(prod)">
                    Agregar
                </v-btn>
                </v-card-actions>
            </v-card>
          </v-col>
      </v-row>
      <div class="text-center" v-if="listaProducto.length >0">
          <v-pagination v-model="page" :length="Math.ceil(listaProducto.length/perPage)"></v-pagination>
      </div>
    </div>
</div>
</template>

<script>
import {mapState} from 'vuex'
import axios from 'axios'
const baseURL = 'http://localhost:3000/productos'

export default {
data(){
    return{
        categoriasProductos: this.$store.state.categorias,
        listaProducto: [],
        productosSeleccionados:[],
        page:1,
        perPage:12,
        cargando: false,
        filros:['PRECIO (ASCENDENTE)','PRECIO (DESCENDENTE)','NOMBRE','STOCK']
    }
},
computed:{
...mapState(['categorias']),
productosVisibles(){
    return this.listaProducto.slice((this.page-1)*this.perPage, this.page*this.perPage)
}
},
watch:{
    categorias(newValue){
        this.categoriasProductos = newValue
    }
},
methods:{
    async cambiarCategoria(categoria){
        this.cargando = true
        this.listaProducto = []
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
    agregarProducto(item){
        this.productosSeleccionados.push(item)
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
        // ACA ME QUEDE, FALTARIAN EL FILTRO POR NOMBRE Y UN INDICADOR PARA LOS PRODUCTOS AGREADOS.
    }
}
}
</script>

<style>

</style>