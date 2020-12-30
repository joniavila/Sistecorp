<template>
	<v-card width="400" class="mx-auto mt-5">
		<v-card-title>
			<h1 class="display-1">Ingreso</h1>
		</v-card-title>
		<v-card-text>
			<v-form>
				<v-text-field v-model="usuario" label="Email" prepend-icon="mdi-account-circle" />
				<v-text-field
					v-model="contraseña"
					:type="showPassword ? 'text' : 'password'"
					label="Contraseña"
					prepend-icon="mdi-lock"
					:append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
					@click:append="showPassword = !showPassword"
				/>
			</v-form>
		</v-card-text>
		<v-alert type="success" 
		:value="alert"
		transition="slide-y-transition"
		>El usuario se ha logueado con exito</v-alert>
		<v-alert color="red" 
		:value="alert2"
		transition="slide-y-transition"
		>Usuario o contraseña incorrectos</v-alert>
		<v-divider></v-divider>
		<v-card-actions>
			<v-btn color="success" @click="register">Registrese</v-btn>
			<v-spacer></v-spacer>
			<v-btn color="info" @click="login">Ingrese</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script>
import axios from 'axios'
const baseURL = 'http://localhost:3000/usuarios'
import {mapState} from 'vuex'

export default {
	name: 'LoginPage',
	data() {
		return {
			showPassword: false,
			usuario:'',
			contraseña:'',
			listaUsuarios: [],
			// ingreso: false,
			errorIngreso: false,
			alert:false,
			alert2: false
		}
	},
	async created(){
      try{
        const res = await axios.get(baseURL)
        this.listaUsuarios = res.data
      }catch(e){
        alert(e)
      }
	},
	mounted: function () {
    if(alert){
	this.hide_alert();
	}
	},
	methods:{
		login(){
			// corrobora que el cliente se encuentre registrado , si es un cliente o un administrador
			this.listaUsuarios.forEach(e => {
				if((this.usuario === e.mail ) && (this.contraseña === e.contraseña)){
					this.$store.state.ingreso = true
					var userData = {
						usuario : this.usuario,
						contraseña: this.contraseña,
						name: e.name
					}
					if(e.administrador === true){
						this.$store.state.administrador = true
					}
					if(e.vendedor === true){
						this.$store.state.vendedor = true
					}
					if(e.vendedor === false && e.administrador === false){
						this.$store.state.usuarioRegistrado = true
					}
					this.alert = true
					localStorage.setItem('user', JSON.stringify(userData.usuario))
					localStorage.setItem('password',JSON.stringify(userData.contraseña))
					localStorage.setItem('name',JSON.stringify(userData.name))
					this.$store.state.user = userData
					this.$router.push('/')
				}
			});
			if(this.ingreso === false){
				this.alert2 = true
			}
		},
		hide_alert: function () {
			// `event` is the native DOM event
			window.setInterval(() => {
				this.alert = false;
				this.alert2 = false
			}, 3000)    
		},
		register(){
			this.$router.push('/signup')
		}
	},
	computed:{
    ...mapState(['ingreso'])
	},
	watch:{
    ingreso(newValue){
      this.ingreso = newValue
    }
  }  
}
</script>

<style></style>
