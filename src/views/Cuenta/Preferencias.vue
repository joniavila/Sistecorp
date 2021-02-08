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
                label="Quiero registrar necesidades habituales de productos"
            ></v-switch>
            </v-col>
        </v-row>
        <v-btn color="success"
        @click="guardarPreferencias">
        GUARDAR CAMBIOS </v-btn>
    </v-container>
  </v-form>
  <!-- TABLA PARA AGREGAR PRODUCTOS DE PREFERENCIA -->
   <v-dialog v-model="necesidades"
        v-on:close-dialog="closeDialog">
       <TablaSeleccionProductos />
       <!-- <v-btn
        color="success"
        @click="guardarProductosPreferencia">
            GUARDAR
        </v-btn> -->
   </v-dialog>
</div>
</template>

<script>
// import axios from 'axios'
import TablaSeleccionProductos from '../../components/TablaSeleccionProductos'


export default {
    data(){
        return {
            datosCliente: this.$store.state.user,
            disabled : true,
            preferencias: {},
            formaDePagoSeleccionada: '',
            formaDeEntregaSeleccionada: '',
            formasPago: this.$store.state.formasPagoOpcionales,
            formasDeEntrega: this.$store.state.formasDeEntregaOpcionales,
            notificaciones: false,
            promociones:false,
            necesidades: false,
            
        }
    },
    components:{
        TablaSeleccionProductos
    },
    methods:{
        guardarPreferencias(){

        },
        closeDialog(){
            this.necesidades= false
        }
    }
}
</script>

<style>

</style>