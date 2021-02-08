<template>
<div>
    <v-form>
    <v-container>
            <h3>DATOS DE LA CUENTA</h3>
        <v-row>
<!-- SECCION DATOS DE LA CUENTA -->
        <v-col
            cols="12"
            sm="6"
        >
        <v-text-field 
            outlined
            :disabled="disabled"
            v-model="datosCliente.razonSocial"
            label="Razon Social"
            :rules="razonSocialRules"
        >
        </v-text-field>
        </v-col>
        <v-col
            cols="12"
            sm="6"
        >
        <v-text-field
            outlined
            :disabled="disabled"
            v-model="datosCliente.cuit"
            label="CUIT"
            :rules="cuitRules"
        >
        </v-text-field>
        </v-col>
        <v-col
            cols="12"
            sm="6"
        >
        <v-text-field
            outlined
            :disabled="disabled"
            v-model="datosCliente.mail"
            label="E-MAIL"
            :rules="emailRules"
        >
        </v-text-field>
        </v-col>
        <v-col
            cols="12"
            sm="6"
        >
        <v-text-field
            outlined
            :disabled="disabled"
            label="NOMBRE CONTACTO"
            v-model="datosCliente.name"
            :rules="nombreRules"
        >
        </v-text-field>
        </v-col>
    <v-btn
    @click="habilitarModificacion"
    color="primary"
    v-if="disabled"
    >
        MODIFICAR DATOS
    </v-btn>
    <div v-if="!disabled">
    <v-btn
    @click="dialogConfirmacion"
    color="success"
    >
        ACEPTAR
    </v-btn>
    <v-btn
    style="margin-left:3px"
    @click="habilitarModificacion"
    color="error"
    >
        CANCELAR
    </v-btn>
    </div>
<!-- DIALOG PARA ACEPTAR MODIFICACIONES -->
    <v-dialog
      v-model="dialog"
      width="500"
      dark
    >
      <v-card>
        <v-card-title>
          CAMBIOS EN DATOS DE CUENTA
        </v-card-title>

        <v-card-text>
          Estos cambios se veran modificados y afectados en las siguientes facturas.
          Desea aceptar los cambios en la cuenta?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="modificarDatos"
          >
            Aceptar
          </v-btn>
          <v-btn
            color="error"
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
<!-- SECCION DE USUARIO Y CONTRASEÑA -->
    </v-row>
    <v-divider style="margin-top:20px"/>
    <v-row>
        <v-col
            cols="12"
            sm="6"
        >
        <v-text-field 
            outlined
            :disabled="disabled2"
            v-model="datosCliente.mail"
            label="USUARIO"
            :rules="emailRules"
        >
        </v-text-field>
        </v-col>
        <v-col
            cols="12"
            sm="6"
        >
        <v-text-field
            v-model="datosCliente.contraseña"
            :disabled="disabled2"
            :type="!disabled2 ? 'text' : 'password'"
            label="CONTRASEÑA"
            prepend-icon="mdi-lock"
        />
        </v-col>
    <v-btn
    @click="disabled2 = false"
    color="primary"
    v-if="disabled2"
    >
        MODIFICAR CONTRASEÑA
    </v-btn>
    <div v-if="!disabled2">
    <v-btn
    @click="dialogContraseña = true"
    color="success"
    >
        ACEPTAR
    </v-btn>
    <v-btn
    style="margin-left:3px"
    @click="habilitarModificacion"
    color="error"
    >
        CANCELAR
    </v-btn>
    </div>
<!-- DIALOG PARA MODIFICAR CONTRASEÑA -->
    <v-dialog
        dark
        v-model="dialogContraseña"
        width="500"
    >
      <v-card>
        <v-card-title>
         CAMBIO USUARIO Y CONTRASEÑA
        </v-card-title>

        <v-card-text>
            Esta seguro que sea modificar la contraseña y usuario de su cuenta?
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="modificarDatos"
          >
            Aceptar
          </v-btn>
          <v-btn
            color="error"
            @click="dialogContraseña = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </v-row>
    </v-container>
    </v-form>
    <!-- ALERTA DE API -->
    <v-snackbar v-model="alert" :timeout="2000" centered :color="colorAlert">
        {{mensajeApi}}
    </v-snackbar>
</div>
</template>

<script>
import {mapState} from 'vuex'
import axios from 'axios'
const baseURL = 'http://localhost:3000/usuarios'
export default {

data(){
    return{
        datosCliente: this.$store.state.user,
        disabled: true,
        emailRules: [
            value => !!value || 'Email es necesario.',
            value => value.indexOf('@') !== 0 || 'Email debe tener un username.',
            value => value.includes('@') || 'Email debe incluir @ simbolo.',
            value =>
                value.indexOf('.') - value.indexOf('@') > 1 ||
                'Email debe contener un dominio valido.',
            value =>
                value.indexOf('.') <= value.length - 3 ||
                'Email should contain a valid domain extension.'
        ],
        cuitRules:[
            value => !!value || 'El CUIL es necesario'
        ],
        nombreRules: [
            value => !!value || 'Debe ingresar un nombre'
        ],
        razonSocialRules: [
            value => !!value || 'Debe ingresar una Razon Social'
        ],
        dialog: false,
        mensajeApi: '',
        colorAlert: '',
        alert :false,
        disabled2: true,
        dialogContraseña: false

    }
},  
computed:{
    ...mapState(['user'])
},
watch:{
    user(newValue){
        this.datosCliente = newValue
    }
},
methods:{
    async modificarDatos(){
        if(this.datosCliente){
            await axios.put(baseURL+`/${this.datosCliente.id}`, this.datosCliente)
            .then(response => {
                if(response.status===200 ||response.status===204 ){
                    this.dialog = false
                    this.dialogContraseña = false
                    this.datosCliente = response.data
                    this.mensajeApi = "DATOS DE CLIENTE MODIFICADOS CON EXITO"
                    this.colorAlert = 'success'
                    this.alert = true
                    this.habilitarModificacion()
                }else{
                    this.dialog = false
                    this.mensajeApi = "HUBO UN ERRROR AL MODIFICAR EL CLIENTE, INTENTE NUEVAMENTE"
                    this.colorAlert = 'error'
                    this.alert = true
                }
            })
        }
    },
    habilitarModificacion(){
        if(this.disabled === false || this.disabled2 === false){
            axios.get(baseURL+`/${this.datosCliente.id}`).then(res => { this.datosCliente = res.data})
            this.disabled = true
            this.disabled2 = true
        }else{
            this.disabled = false
        }
    },
    dialogConfirmacion(){
        this.dialog = true
    },
}
}
</script>

<style>

</style>