<template>
  <v-card v-if="pedido">
        <v-card-title style="color:#6aaaff">
            {{pedido.solicitud}} NRO {{ pedido.id}}
        </v-card-title>
        <v-card-text class="">
        <v-card-title style="color:#6aaaff">DATOS CLIENTE</v-card-title>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title>Mail Cliente: {{pedido.datosPedido.usuarioRegistrado}}</v-list-item-title>
                    <v-list-item-title>Razon Social: {{pedido.datosPedido.razonSocial}}</v-list-item-title>
                    <v-list-item-title>CUIT: {{pedido.datosPedido.cuit}}</v-list-item-title>
                    <v-list-item-title>Forma de Pago: {{pedido.datosPedido.formaPago}}</v-list-item-title>
                    <v-list-item-title>Forma de Entrega: {{pedido.datosPedido.formaEntrega}}</v-list-item-title>
                    <v-list-item-title>Fecha Estimada de Entrega: {{pedido.datosPedido.fechaEntrega}}</v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        <v-card-title style="color:#6aaaff">PRODUCTOS </v-card-title>
            <template>
                <span style="color:#6aaaff">PRODUCTOS SOLICITADOS</span> 
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
                        v-for="item in pedido.productos"
                        :key="item.id"
                        >
                        <td>{{ item.NOMBRE }}</td>
                        <td>{{ item.CANTIDAD }}</td>
                        <td>{{ item.PRECIO }}</td>
                        </tr>
                    </tbody>
                    </template>
                </v-simple-table>
            </template>
            <div style="margin:20px"></div>
            <template v-if="((pedido.estado=== 'COTIZADO') || (pedido.estado === 'FACTURADO')) && (pedido.solicitud === 'COTIZACION')  ">
                <span style="color:#6aaaff">PRODUCTOS COTIZADOS</span> 
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
                        v-for="item in pedido.productosCotizados"
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
            <v-card-title v-if="(pedido.estado === 'COTIZADO') && (pedido.monto != '')">MONTO COTIZADO: ${{pedido.monto}} </v-card-title>
            <v-card-title v-if="pedido.estado === 'FACTURADO'">MONTO FACTURA: ${{pedido.monto}} </v-card-title>
        </v-card-text>
        <v-card-actions>
        </v-card-actions>
      </v-card>
</template>

<script>
export default {
data(){
    return {
    }
},
methods:{
},
props:{
    pedido: Object,
}
}
</script>

<style>

</style>