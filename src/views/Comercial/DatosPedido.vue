<template>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >
<!-- FECHA DEL PEDIDO -->
<v-col cols="12" sm="6" md="8">
	<v-text-field
		v-model="date"
		label="Fecha Actual"
		persistent-hint
		prepend-icon="mdi-calendar"
	></v-text-field>
</v-col>

<!-- FECHA DE ENTREGA -->
<v-col cols="12" sm="6" md="8">
	<v-menu
	v-model="menu2"
	:close-on-content-click="false"
	transition="scale-transition"
	offset-y max-width="290px" min-width="290px">
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="fechaEntrega"
              label="Fecha prevista de entrega"
				:rules="[v => v > date || 'Seleccione una fecha posterior al dia actual']"
              persistent-hint
              prepend-icon="mdi-calendar"
              readonly	
              v-on="on"
            ></v-text-field>
          </template>
		<v-date-picker v-model="fechaEntrega" no-title @input="menu2 = false"></v-date-picker>
	</v-menu>
</v-col>
<div v-if="!esPedidoWeb">
<v-col cols="12" sm="6" md="8">
	<v-btn
		color="primary"
		elevation="2"
		@click="cargarDatos"
	>UTILIZAR DATOS REGISTRADOS DE USUARIO</v-btn>
</v-col>
<!-- NOMBRE DE CONTACTO -->
<v-col cols="12" sm="6" md="8">
    <v-text-field
      v-model="nombre"
      :counter="10"
      label="Nombre de contacto"
      required
    ></v-text-field>
</v-col>
<!-- EMAIL DEL COMPRADOR -->
<v-col cols="12" sm="6" md="8">
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>
</v-col>
</div>
<!-- FORMA DE PAGO -->
<v-col cols="12" sm="6" md="8">
	<v-select
	v-model="formaDePagoSeleccionada"
	:items="formasPago"
	:rules="[v => !!v || 'Seleccione una forma de pago']"
	label="Forma de pago"
	required
	offset-y
	></v-select>
</v-col>
<!-- FORMA DE ENVIO -->
<v-col cols="12" sm="6" md="8">
	<v-select
	v-model="formaDeEntregaSeleccionada"
	:items="formasDeEntrega"
	:rules="[v => !!v || 'Seleccione una forma de entrega']"
	label="Forma de Envio"
	required 
	offset-y
	></v-select>
</v-col>
<div style="width:100%;height:30px">
</div>	

<!-- BOTONES  -->
    <v-btn
      :disabled="!valid"
		small
      color="success"
      class="mr-4"
      @click="validate"
    >
      Confirmar Datos
    </v-btn>

    <v-btn
		small
      color="error"
      class="mr-4"
      @click="reset"
    >
      Reiniciar pedido
    </v-btn>
  <div style="width:100%;height:30px"></div>
  </v-form>
</template>

<script>
import {mapState} from 'vuex'

export default {
data: () => ({
	esPedidoWeb: false,
	date: new Date().toISOString().substr(0, 10),
	fechaEntrega: '',
	menu2: false,
	valid: true,
	nombre: '',
	email: '',
	emailRules: [
	v => !!v || 'E-mail es un campo obligatorio',
	v => /.+@.+\..+/.test(v) || 'E-mail debe contener un dominio'],
	formaDePagoSeleccionada: null,
	formasPago: this.$store.state.formasPagoOpcionales,
	formaDeEntregaSeleccionada:null,
	formasDeEntrega: this.$store.state.formasDeEntregaOpcionales,
	checkbox: false,
	pedidoGuardado: null,
	datosUsuarioRegistrado:''
}),
mounted(){
	this.esPedidoWeb = this.$store.state.esPedido
	this.pedidoGuardado = this.$store.state.datosPedidoNuevo
	this.datosUsuarioRegistrado = this.$store.state.user
	if(this.pedidoGuardado){
		this.fechaEntrega= this.pedidoGuardado.fechaEntrega
		this.nombre = this.pedidoGuardado.nombreContacto
		this.email= this.pedidoGuardado.mailContacto
		this.formaDePagoSeleccionada = this.pedidoGuardado.formaPago
		this.formaDeEntregaSeleccionada = this.pedidoGuardado.formaEntrega
	}
	this.$store.state.esPedido = false
},
computed:{
    ...mapState(['datosPedidoNuevo','esPedido','user'])
},
watch:{
    datosPedidoNuevo(newValue){
		this.pedidoGuardado = newValue
	},
	esPedido(newValue){
		if(newValue){
			this.esPedidoWeb = newValue
		}
	},
	user(newValue){
		this.datosUsuarioRegistrado = newValue
	}
},
methods: {
	validate () {
		if(this.$refs.form.validate()){
			//guardamos los datos del pedido
			if(this.esPedidoWeb){
				this.$store.state.datosPedidoNuevo = {
				fecha: this.date,
				usuarioRegistrado: this.datosUsuarioRegistrado.mail,
				fechaEntrega:this.fechaEntrega,
				nombreContacto: this.datosUsuarioRegistrado.name,
				mailContacto: this.datosUsuarioRegistrado.mail,
				cuit: this.datosUsuarioRegistrado.cuit,
				razonSocial: this.datosUsuarioRegistrado.razonSocial,
				formaPago:this.formaDePagoSeleccionada,
				formaEntrega:this.formaDeEntregaSeleccionada
				}
				this.$router.push('/confirmacionPedido')
			}else{
				this.$store.state.datosPedidoNuevo = {
				fecha: this.date,
				usuarioRegistrado: this.datosUsuarioRegistrado.mail,
				fechaEntrega:this.fechaEntrega,
				nombreContacto: this.nombre,
				mailContacto: this.email,
				cuit: this.datosUsuarioRegistrado.cuit,
				razonSocial: this.datosUsuarioRegistrado.razonSocial,
				formaPago:this.formaDePagoSeleccionada,
				formaEntrega:this.formaDeEntregaSeleccionada
				}
				this.$router.push('/cargaProductos')
			}
		}
	},
	reset () {
		this.$refs.form.reset()
	},
	cargarDatos(){
		this.email = this.datosUsuarioRegistrado.mail
		this.nombre = this.datosUsuarioRegistrado.name
	}
},
}
</script>
