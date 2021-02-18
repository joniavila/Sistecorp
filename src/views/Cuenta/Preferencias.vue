<template>
<div>
  <v-form>
    <v-container>
            <h3>PREFRENCIAS DE LA CUENTA</h3>
        <v-row>
<!-- SECCION DATOS DE LA CUENTA -->
            <v-col
                cols="12"
                sm="6"
            >
            <v-select
                v-model="formaDePagoSeleccionada"
                :items="formasPago"
                label="Forma de pago"
                required
                offset-y
            ></v-select>
            </v-col>
            <v-col
                cols="12"
                sm="6"
            >
            <v-select
                v-model="formaDeEntregaSeleccionada"
                :items="formasDeEntrega"
                label="Forma de Entrega"
                required
                offset-y
            ></v-select>
            </v-col>
            <v-col
            cols="12"
            sm="6"
            >
            <v-switch
                color="primary"
                v-model="promociones"
                label="Quiero recibir mails sobre promociones"
            ></v-switch>
            </v-col>
            <v-col
            cols="12"
            sm="6"
            >
            <v-switch
                color="primary"
                v-model="notificaciones"
                label="Quiero recibir notificaciones sobre presupuestos y facturacion"
            ></v-switch>
            </v-col>
            <v-col
            cols="12"
            sm="6"
            >
            <v-switch
                color="primary"
                v-model="necesidades"
                @change="cambiarNecesidades($event)"
                label="Quiero registrar necesidades habituales de productos"
            ></v-switch>
            </v-col>
        </v-row>
    </v-container>
  </v-form>
  <!-- TABLA PARA AGREGAR PRODUCTOS DE PREFERENCIA -->
   <v-dialog v-model="modal">
       <TablaSeleccionProductos />
       <v-btn
        color="success"
        @click="guardarProductosPreferencias">
            GUARDAR
        </v-btn>
        <v-btn
        color="error"
        @click="modal= false">
            CANCELAR
        </v-btn>
   </v-dialog>
   <!-- BOTON PARA GUARDAR PREFRENCIAS -->
    <v-btn color="success"
    bottom
    style="margin-left: 50%;"
    @click="guardarPreferencias">
    GUARDAR CAMBIOS </v-btn>
   <!-- PRODUCTOS DE PREFERENCIA -->
   <div v-if="necesidades">
    <v-list dark>
          
        PRODUCTOS DE PREFERENCIA
      <v-list-item-group>
        <v-list-item
          v-for="(item, i) in productosNecesidades"
          :key="i"
          dense
        >
          <v-list-item-content>
            <v-list-item-subtitle v-text="item.nombre"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
                <v-icon @click="eliminarProducto(item)">mdi-delete</v-icon>
              </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
   </div>
   <!-- ALERTA  -->
    <v-snackbar v-model="snackbar" :timeout="2000" centered :color="colorSnackBar">
    {{mensaje}}
    </v-snackbar>
</div>
</template>

<script>
// import axios from 'axios'
import TablaSeleccionProductos from '../../components/TablaSeleccionProductos'
import {mapState} from 'vuex'
import axios from 'axios'
const baseURL = 'http://localhost:3000/usuarios'
export default {
    data(){
        return {
            datosCliente: {},
            disabled : true,
            preferencias: {},
            formaDePagoSeleccionada: '',
            formaDeEntregaSeleccionada: '',
            formasPago: this.$store.state.formasPagoOpcionales,
            formasDeEntrega: this.$store.state.formasDeEntregaOpcionales,
            notificaciones: false,
            promociones:false,
            necesidades: false,
            productosNecesidades: [],
            modal:false,
            snackbar:false,
            mensaje:'',
            colorSnackBar: ''
        }
    },
    created(){
        axios.get(baseURL+`/${this.$store.state.user.id}`)
        .then(res => { this.datosCliente = res.data})
        .then(()=>{
            this.formaDePagoSeleccionada = this.datosCliente.preferencias.formaPago
            this.formaDeEntregaSeleccionada = this.datosCliente.preferencias.formaEntrega
            this.promociones = this.datosCliente.preferencias.promociones
            this.notificaciones = this.datosCliente.preferencias.notificaciones
            this.necesidades = this.datosCliente.preferencias.necesidades
            if(this.datosCliente.preferencias.productosNecesidades){
                this.productosNecesidades = this.datosCliente.preferencias.productosNecesidades
            }
        })
    },
    components:{
        TablaSeleccionProductos
    },
    computed:{
        ...mapState(['productosPreferencia','user'])
    },
    methods:{
        async guardarPreferencias(){
            //CREACION DEL OBJETO USUARIO PARA MODIFICAR
            var usuario = {
                id: this.datosCliente.id,
                name: this.datosCliente.name,
                cuit: this.datosCliente.cuit,
                razonSocial: this.datosCliente.razonSocial,
                mail: this.datosCliente.mail,
                contraseña: this.datosCliente.contraseña,
                administrador: this.datosCliente.administrador,
                vendedor: this.datosCliente.vendedor,
                preferencias: {
                    formaPago: this.formaDePagoSeleccionada,
                    formaEntrega: this.formaDeEntregaSeleccionada,
                    notificaciones: this.notificaciones,
                    promociones: this.promociones,
                    necesidades: this.necesidades,
                    productosNecesidades: this.productosNecesidades
                }
            }

            await axios.put(baseURL+`/${this.datosCliente.id}`, usuario).then(res =>{
                if(res.status === 200){
                    this.mensaje= "PREFRENCIAS MODIFICADAS CON EXITO"
                    this.colorSnackBar = 'success'
                    this.snackbar = true
                    this.datosCliente = res.data
                    this.formaDePagoSeleccionada = res.data.preferencias.formaPago
                    this.formaDeEntregaSeleccionada = res.data.preferencias.formaEntrega
                    this.promociones = res.data.preferencias.promociones
                    this.notificaciones = res.data.preferencias.notificaciones
                    if(res.data.preferencias.necesidades){
                        this.necesidades = res.data.preferencias.necesidades
                        this.productosNecesidades = res.data.preferencias.productosNecesidades
                    }
                }else{
                    this.mensaje= "HUBO UN ERROR AL MODIFICAR LAS PREFERENCIAS"
                    this.colorSnackBar = 'error'
                    this.snackbar = true
                }
            })

        },
        closeDialog(){
            this.modal= false
        },
        guardarProductosPreferencias(){
            this.modal = false
            this.productosNecesidades = this.$store.state.productosPreferencia
            this.necesidades = true
        },
        cambiarNecesidades(event){
            if(event){
                this.modal= true
            }else{
                this.modal = false
                this.necesidades = false
                this.productosNecesidades = []
            }
        },
        eliminarProducto(item){
            var indexItem = this.productosNecesidades.indexOf(item)
            this.productosNecesidades.splice(indexItem,1)
        }
    }
}
</script>

<style>

</style>