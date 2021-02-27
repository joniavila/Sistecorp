<template>
  <v-container>
    <h1 style="text-align:center">Dashboard</h1>

    <v-row>
      <v-col v-for="sale in sales" :key="`${sale.title}`" cols="12" md="4">
        <SalesGraph :sale="sale" />
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="statistic in statistics"
        :key="`${statistic.title}`"
        cols="12"
        md="6"
        lg="3"
      >
        <StatisticCard :statistic="statistic" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">
        
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="8">

      </v-col>
    </v-row>

    <div style="display:flex">
      <v-data-table :headers="headers" :items="productos"
      :footer-props="{'items-per-page-text':'Productos por pagina'}"
      no-data-text = 'NO HA CARGADO NINGUN PRODUCTO'
      sort-by="CANTIDAD" :items-per-page="5"
      dense>
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>PRODUCTOS FALTANTES (10 unidades o menos)</v-toolbar-title>
        </v-toolbar>
      </template>
        </v-data-table>
        <div style="margin:10px"></div>
      <EmployeesTable  :usuarios="usuarios" @select-employee="setEmployee" />
    </div>
      </v-container>
</template>

<script>
import EmployeesTable from '../../components/EmployeesTable'
// import EventTimeline from '../components/EventTimeline'
import SalesGraph from '../../components/SalesGraph'
import StatisticCard from '../../components/StatisticCard'

import employeesData from '../../data/employees.json'
import timelineData from '../../data/timeline.json'
import salesData from '../../data/sales.json'
import axios from 'axios'
const BaseUrlUsuarios = 'http://localhost:3000/usuarios '
const BaseUrlProducto = 'http://localhost:3000/productos'

export default {
  name: 'DashboardPage',
  components: {
    EmployeesTable,
    // EventTimeline,
    SalesGraph,
    StatisticCard
  },
  data() {
    return {
      employees: employeesData,
      loadNewContent: false,
      sales: salesData,
      selectedEmployee: {
        name: '',
        title: ''
      },
      snackbar: false,
      statistics: [
        {
          "title": "Presupuestos del Mes",
          "value": "65"
        },
        {
          "title": "Monto Facturado",
          "value": "$983.000"
        },
        {
          "title": "Promedio Markup",
          "value": "30%"
        },
        {
          "title": "Ganancias Estimadas (Mes en Curso)",
          "value": "$294.900"
        },
        {
          "title": "Presupuestos Pendientes (Mes en Curso)",
          "value": "5"
        },
        {
          "title": "Presupuestos Enviados (Mes en Curso)",
          "value": "10"
        },
        {
          "title": "Pedidos Web",
          "value": "20"
        },
        {
          "title": "Monto de Compras a Proveedores",
          "value": "$50000"
        }
      ],
      timeline: timelineData,
      usuarios: [],
      productos: [],
      headers:[
                {
                    text:'ID',
                    value:'id'
                },
                {
                    text:'NOMBRE',
                    align: 'left',
                    sortable: false,
                    value: 'NOMBRE'
                },
                {
                    text:'CATEGORIA',
                    value:'CATEGORIA'
                },
                {
                    text:'PROVEEDOR',
                    value:'PROVEEDOR',sortable: true,
                },
                {
                    text:'CANTIDAD',
                    value:'CANTIDAD',sortable: true,
                },
            ],
    }
  },
  mounted(){
    axios.get(BaseUrlUsuarios).then(res => {
      if(res.status === 200){
        this.usuarios= res.data
      }
    })
    axios.get(BaseUrlProducto+`?CANTIDAD_lte=10`).then(res =>{
      if(res.status === 200){
        this.productos = res.data
      }
    })
  },
  methods: {
    setEmployee(event) {
      this.snackbar = true
      this.selectedEmployee.name = event.name
      this.selectedEmployee.title = event.title
    },
    showMoreContent(entries) {
      this.loadNewContent = entries[0].isIntersecting
    }
  }
}
</script>
