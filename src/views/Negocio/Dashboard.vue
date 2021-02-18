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
        <EmployeesTable :usuarios="usuarios" @select-employee="setEmployee" />
      </v-col>
    </v-row>

    <v-row id="below-the-fold" v-intersect="showMoreContent">
      <v-col cols="12" md="8">
      </v-col>

    </v-row>
    <v-snackbar v-model="snackbar" :left="$vuetify.breakpoint.lgAndUp">
      You have selected {{ selectedEmployee.name }},
      {{ selectedEmployee.title }}
      <v-btn color="pink" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-divider></v-divider>
    <h2>PRODUCTOS FALTANTES</h2>
    <div>
      <v-data-table :headers="headers" :items="productos" class="elevation-1"
      :footer-props="{'items-per-page-text':'Productos por pagina'}"
      no-data-text = 'NO HA CARGADO NINGUN PRODUCTO'
      sort-by="CANTIDAD">
        <v-toolbar flat>
          <v-toolbar-title>PRODUCTOS</v-toolbar-title>
        </v-toolbar>
        </v-data-table>
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
import statisticsData from '../../data/statistics.json'
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
      statistics: statisticsData,
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
