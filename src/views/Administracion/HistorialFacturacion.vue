<template>
  <div>
      <v-data-table :headers="headers" :items="facturas" class="elevation-1"
    :footer-props="{'items-per-page-text':'Pedidos por pagina'}"
    no-data-text = 'NO TIENE UN HISTORIAL DE FACTURAS REGISTRADAS'>
    <template v-slot:top>
    <v-toolbar flat>
        <v-toolbar-title>FACTURAS REALIZADAS</v-toolbar-title>
    </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon @click="verFactura(item)">mdi-eye</v-icon>
      <v-icon @click="enviarFactura()">mdi-email-send-outline</v-icon>
    </template>
    </v-data-table>
    <v-snackbar v-model="snackbar" :timeout="2000" centered top :color="colorSnackBar">
        {{mensaje}}
    </v-snackbar>
    <!-- DIALOG PARA VER EL PEDIDO SIN COTIZAR -->
    <v-dialog
        v-model="dialog"
        persistent
        max-width="500"
        dark>
        <v-card v-if="facturaAver">
        <v-card-title style="color:#6aaaff">
            FACTURA NRO {{ facturaAver.id}}
        </v-card-title>
        <v-card-text>
        <v-card-title style="color:#6aaaff">DATOS CLIENTE</v-card-title>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Mail Cliente: {{facturaAver.datosCliente.MailCliente}}</v-list-item-title>
                    <v-list-item-title>Razon Social: {{facturaAver.datosCliente.cliente}}</v-list-item-title>
                    <v-list-item-title>CUIT: {{facturaAver.datosCliente.CUIT}}</v-list-item-title>
                    <v-list-item-title>Forma de Pago: {{facturaAver.formaDePago}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        <v-card-title style="color:#6aaaff">PRODUCTOS</v-card-title>
            <template>
                <v-simple-table dense>
                    <template v-slot:default>
                    <thead>
                        <tr>
                        <th class="text-left">
                            PRODUCTO
                        </th>
                        <th class="text-left">
                            CANTIDAD
                        </th>
                        <th class="text-left">
                            PRECIO + IVA
                        </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                        v-for="item in facturaAver.productos"
                        :key="item.id"
                        >
                        <td>{{ item.NOMBRE }}</td>
                        <td>{{ item.CANTIDADSOLICITADA }}</td>
                        <td>{{ item.PRECIO }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </template>
            <v-card-title style="color:#6aaaff">MONTO FINAL FACTURADO : ${{facturaAver.monto}}</v-card-title>   
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            @click="hideDialog()"
          >
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from 'axios'
const BaseURL = 'http://localhost:3000/facturas'
export default {
data(){
    return{
        facturas:[],
        headers:[
            {text:'NRO',value:'id'},
            {text:'FECHA',value:'fecha'},
            {text:'CLIENTE',value:'datosCliente.cliente'},
            {text:'CUIT',value:'datosCliente.CUIT'},
            {text:'FORMA DE PAGO',value:'formaDePago'},
            {text:'MONTO',value:'monto'},
            {text: 'ACCIONES', value: 'actions', sortable: false },
            ],
        dialog: false,
        snackbar: false,
        colorSnackBar:'',
        mensaje:'',
        facturaAver:''
    }
},
mounted(){
    axios.get(BaseURL).then(res => { if(res.status === 200){
        this.facturas = res.data
    }})
},
methods:{
    hideDialog(){
        this.dialog =false
        this.facturaAver = ''
    },
    verFactura(item){
        this.facturaAver = item
        this.dialog = true
    },
    enviarFactura(){
        this.mensaje = 'FACTURA ENVIADA POR MAIL CON EXITO'
        this.colorSnackBar = 'success'
        this.snackbar = true
    }
}
}
</script>

<style>

</style>