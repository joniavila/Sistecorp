<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>Registro</h1>
        <v-form ref="signUpForm" v-model="formValidity">
          <v-text-field
            label="Email"
            type="email"
            v-model="email"
            :rules="emailRules"
            required
          ></v-text-field>
          <v-text-field
            v-model="contraseña"
            label="Contraseña"
            :rules="contraRules"
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="cuit"
            label="CUIT o CUIL (sin guiones)"
            :rules="cuitRules"
          ></v-text-field>
          <v-text-field
            v-model="nombre "
            label="Nombre de Usuario"
            :rules="nombreRules"
          ></v-text-field>
          <v-text-field
            v-model="razonSocial"
            label="Razon Social"
            :rules="nombreRules"
          ></v-text-field>
          <v-text-field
            type="number"
            v-model="numeroTel"
            label="Numero de Telefono"
            :rules="telRules"
          ></v-text-field>
          <v-checkbox
            label="Acepto los terminos y condiciones"
            v-model="agreeToTerms"
            :rules="agreeToTermsRules"
            required
          ></v-checkbox>
          <v-btn
            color="primary"
            class="mr-4"
            :disabled="!formValidity"
            @click="registrarUsuario"
            >Registrarse</v-btn
          >
          <v-btn color="success" class="mr-4" @click="validateForm"
            >Validar Formulario</v-btn
          >
          <v-btn color="warning" @click="resetForm">Restaurar Formulario</v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-alert :color="colorSnackBar" v-model="snackbar" :timeout="2000" centered >{{mensaje}}</v-alert>
  </v-container>
</template>

<script>
import axios from 'axios'
import {mapState} from 'vuex'

const baseURL = 'http://localhost:3000/usuarios'
export default {
  data: () => ({
    colorSnackBar: '',
    snackbar:false,
    mensaje: '',
    agreeToTerms: false,
    agreeToTermsRules: [
      value =>
        !!value ||
        'Debe aceptar los terminos y condiciones para crear una cuenta.'
    ],
    email: '',
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
    cuit:'',
    cuitRules:[
      value => !!value || 'El CUIL es necesario'
    ],
    contraseña:'',
    contraRules:[
      value => !!value || 'Debe ingresar una contraseña',
      value => value.length > 5 || 'La contraseña debe tener una longitud mayor a 5 caracteres'
    ],
    formValidity: false,
    nombre:'',
    razonSocial: '',
    nombreRules: [
      value => !!value || 'Debe ingresar un nombre'
    ],
    numeroTel: '',
    telRules: [
      value => !!value || 'Debe ingresar un numero de Telefono'
    ],
    listaUsuarios: [],
    vendedorApp: false
  }),
  async created(){
      try{
        const res = await axios.get(baseURL)
        this.listaUsuarios = res.data
      }catch(e){
        alert(e)
      }
      window.setInterval(() => {
        this.snackbar = false
    }, 3000)
  },
  computed:{
    ...mapState(['vendedor'])
  },
  mounted(){
    this.vendedorApp = this.$store.state.vendedor
  },
  methods: {
    resetForm() {
      this.$refs.signUpForm.reset()
    },
    resetValidation() {
      this.$refs.signUpForm.resetValidation()
    },
    validateForm() {
      this.$refs.signUpForm.validate()
    },
    async registrarUsuario(){
      var id = this.listaUsuarios.length+1
      var user = {
        id: id,
        name: this.nombre,
        cuit: this.cuit,
        razonSocial: this.razonSocial,
        mail: this.email,
        contraseña:this.contraseña,
        administrador:false,
        vendedor:false,
        superAdministrador:false,
      }
      try{
        if(user){
          await axios.post(baseURL, user).then(res =>{
            if(res.status === 201 ||res.status === 200 ){
              this.colorSnackBar = 'success'
              this.mensaje = 'EL USUARIO HA SIDO REGISTRADO CON EXITO'
              this.snackbar = true
              this.listaUsuarios = [...this.listaUsuarios, res.data]
              this.resetForm()
            }else{
              this.colorSnackBar = 'error'
              this.mensaje = 'HUBO UN ERROR AL CARGAR EL USUARIO, INTENTE NUEVAMENTE'
              this.snackbar = true
            }
          }).then( () => {
            if(this.vendedorApp){
              this.resetForm()
            }else{
              this.$router.push('/login')
            }
          })
          
        }
      }catch(e){
        alert(e)
      }
    }
  }
}
</script>
