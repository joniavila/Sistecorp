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
      color="success"
      class="mr-4"
      @click="validate"
    >
      Validar
    </v-btn>

    <v-btn
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
	formasPago: [
	'Contado Efectivo',
	'Contado Transferencia',
	'Tarjeta',
	'Tarjeta en cuotas',
	'Cheque a 30 dias',
	'Cheque a 60 dias',
	'Cheque a 90 dias'
	],
	formaDeEntregaSeleccionada:null,
	formasDeEntrega:[
		'Envio a cargo del proveedor',
		'Retiro por oficina comercial',
		'Envio por correo'
	],
	checkbox: false,
}),
computed:{
    ...mapState(['datosPedidoNuevo'])
},
watch:{
    datosPedidoNuevo(newValue){
        this.date = newValue.fecha
        this.fechaEntrega = newValue.fechaEntrega
        this.nombre= newValue.nombreContacto
        this.email = newValue.mailContacto
        this.formaDePagoSeleccionada = newValue.formaPago
        this.formaDeEntregaSeleccionada = newValue.formaEntrega
    }
},
	methods: {
		validate () {
			if(this.$refs.form.validate()){
				//guardamos los datos del pedido
				this.$store.state.datosPedidoNuevo = {
					fecha: this.date,
					fechaEntrega:this.fechaEntrega,
					nombreContacto:this.nombre,
					mailContacto: this.email,
					formaPago:this.formaDePagoSeleccionada,
					formaEntrega:this.formaDeEntregaSeleccionada
				}
				this.$router.push('/seleccionProductos')
			}
		},
		reset () {
			this.$refs.form.reset()
		},
	},
}
</script>
