<template>
  <v-data-table :headers="headers" :items="productos" class="elevation-1"
  :footer-props="{'items-per-page-text':'Productos por pagina'}"
  :search="busqueda">
    <!-- TOOLBAR PARA AGREGAR PRODUCTOS -->
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>PRODUCTOS</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
        v-model="busqueda"
        append-icon="mdi-magnify"
        label="BUSQUEDA"
        single-line
        hide-details
      ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
              NUEVO PRODUCTO
            </v-btn>
          </template>
          <!-- CARD PARA AGREGAR PRODUCTOS -->
          <v-card app dark>
            <v-card-title>
              <span class="headline">INGRESAR NUEVO PRODUCTO</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="newItem.NOMBRE"
                      label="NOMBRE"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      :items="categoriaProductos"
                      label="CATEGORIA"
                      v-model="newItem.CATEGORIA"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="newItem.PRECIO"
                      label="PRECIO"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-select
                      :items="proveedoresProductos"
                      label="PROVEEDOR"
                      v-model="newItem.PROVEEDOR"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="newItem.CANTIDAD"
                      label="CANTIDAD"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- DIALOG PARA ELIMINAR UN PRODUCTO DE LA LISTA -->
        <v-dialog v-model="dialogDelete" max-width="700px">
          <v-card>
            <v-card-title class="headline">Esta seguro que desea eliminar este producto?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">Confirmar</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
            <v-snackbar v-model="snackbar" :timeout="2000" centered :color="colorSnackBar">
              {{mensaje}}
            </v-snackbar>
      </v-toolbar>
    </template>
    <!-- EDIT Y DELETE ITEMS  -->
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small @click="deleteItem(item)" >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>


<script>
import axios from 'axios'
import {mapState} from 'vuex'
const baseURL = 'http://localhost:3000/productos'

export default {    
    data(){
        return {
          busqueda:'',
          categoriaProductos:this.$store.state.categorias,
          proveedoresProductos:this.$store.state.proveedores,
          headers:[
                {
                    text:'ID',
                    value:'id'
                },
                {
                    text:'NOMBRE',
                    align: 'left',
                    value: 'NOMBRE'
                },
                {
                    text:'CATEGORIA',
                    value:'CATEGORIA'
                },
                {
                    text:'PRECIO($USD)',
                    value:'PRECIO'
                },
                {
                    text:'PROVEEDOR',
                    value:'PROVEEDOR'
                },
                {
                    text:'CANTIDAD',
                    value:'CANTIDAD'
                },
                { text: 'Actions', value: 'actions', sortable: false },
            ],
            productos:[],
            dialogDelete: false,
            dialog:false,
            editedItem: {
                id: '',
                NOMBRE: '',
                CATEGORIA: '',
                PRECIO: '',
                PROVEEDOR: ''
            },
            newItem: {
                id: '',
                NOMBRE: '',
                CATEGORIA: '',
                PRECIO: '',
                PROVEEDOR: '',
                CANTIDAD: ''
            },
          deleteProducto:{},
          ultimoId:'',
          snackbar:false,
          colorSnackBar:'',
          mensaje:''
        }
    },
    async mounted(){
      try{
        const res = await axios.get(baseURL)
        this.productos = res.data
      }catch(e){
        alert(e)
      }
    },
    computed:{
    ...mapState(['categorias'])
    },
    methods:{
        editItem(){
          
        },
        deleteItem(item){
          this.dialogDelete = true
          this.deleteProducto = item
        },
        close(){
            this.dialog = false
        },
        async save(){
        await axios.post(baseURL, { 
            "NOMBRE":this.newItem.NOMBRE.toUpperCase(), 
            "CATEGORIA":this.newItem.CATEGORIA, 
            "PRECIO":this.newItem.PRECIO, 
            "PROVEEDOR":this.newItem.PROVEEDOR,
            "CANTIDAD":this.newItem.CANTIDAD
        }).then(res =>{
          this.dialog = false
          if(res.status != 500){
            this.mensaje = "PRODUCTO CARGADO CON EXITO"
            this.colorSnackBar = 'green'
            this.snackbar = true
            this.newItem= {
                id: '',
                NOMBRE: '',
                CATEGORIA: '',
                PRECIO: '',
                PROVEEDOR: '',
                CANTIDAD: ''
            }
          }else{
            this.mensaje = "ERROR: PRODUCTO NO INGRESADO"
            this.colorSnackBar= 'red'
            this.snackbar = true 
          }
        })
        },
        closeDelete(){
          this.dialogDelete = false
          this.deleteProducto = {}
        },
        async deleteItemConfirm(){
          await axios.delete(`http://localhost:3000/productos/${this.deleteProducto.id}`)
          .then(res => {
            this.dialogDelete = false
            if(res.status === 200){
              this.mensaje = "PRODUCTO ELIMINADO CON EXITO"
              this.colorSnackBar = 'green'
              this.snackbar = true
            }else{
              this.mensaje = 'ERROR: EL PRODUCTO NO SE ELIMINO'
              this.colorSnackBar = 'red'
              this.snackbar = true
            }
          }).then(()=>{
            axios.get(baseURL).then(res => { this.productos = res.data})
          })
        },
        initialize(){}
    },
    watch:{
    categorias(newValue){
      this.categoriaProductos = newValue
    }
    }
}
</script>

<style>

</style>