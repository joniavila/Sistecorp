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
		<!-- ALERTS -->
		<v-alert type="success" 
		:value="alert"
		transition="slide-y-transition"
		>EL USUARIO SE HA LOGUEADO CON EXITO</v-alert>
		<v-alert color="error" 
		:value="alert2"
		transition="slide-y-transition"
		>USUARIO O CONTRASEÑA INCORRECTO</v-alert>
		<v-alert color="error" 
		:value="alert3"
		transition="slide-y-transition"
		>SE PRODUJO UN ERROR AL INGRESAR, INTENTE NUEVAMENTE</v-alert>
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
			alert2: false,
			alert3:false
		}
	},
	async created(){
	},
	mounted: function () {
    if(alert){
	this.hide_alert();
	}
	},
	methods:{
		async login(){
			await axios.get(baseURL+`?q=${this.usuario}`).then(res => {
				if(res.status === 200){
					if(res.data){
						if(res.data[0].contraseña === this.contraseña){
							this.$store.state.ingreso = true
							if(res.data[0].administrador === true){
								this.$store.state.administrador = true
							}
							if(res.data[0].vendedor === true){
								this.$store.state.vendedor = true
							}
							if(res.data[0].vendedor === false && res.data[0].administrador === false){
								this.$store.state.usuarioRegistrado = true
							}
							this.alert = true
							localStorage.setItem('user', JSON.stringify(res.data[0].mail))
							localStorage.setItem('password',JSON.stringify(res.data[0].contraseña))
							localStorage.setItem('name',JSON.stringify(res.data[0].name))
							this.$store.state.user = res.data[0]
							this.$router.push('/')
						}else{
							this.alert2 = true
						}
					}else{
						this.alert2 = true
					}
				}else{
					this.alert3 = true
				}
			})
		},
		hide_alert: function () {
			// `event` is the native DOM event
			window.setInterval(() => {
				this.alert = false;
				this.alert2 = false
				this.alert3 = false
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
