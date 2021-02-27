<template>
  <v-data-table
    :headers="headers"
    :items="usuarios"
    :items-per-page="5"
    :multi-sort="true"
    dense
  >
  <template v-slot:top>
   <v-toolbar flat>
      <v-toolbar-title>USUARIOS REGISTRADOS</v-toolbar-title>
    </v-toolbar>
  </template>
  <template v-slot:[`item.administrador`]="{ item }">
        <v-simple-checkbox
          v-model="item.administrador"
          disabled
        ></v-simple-checkbox>
  </template>
  <template v-slot:[`item.vendedor`]="{ item }">
        <v-simple-checkbox
          v-model="item.vendedor"
          disabled
        ></v-simple-checkbox>
  </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'EmployeesTable',
  props: {
    usuarios: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nombre', value: 'name' },
      { text: 'Mail', value: 'mail' },
      { text: 'Administrador', value: 'administrador' },
      { text: 'vendedor', value: 'vendedor' }
    ]
  }),
  methods: {
    // selectRow(event) {
    //   const employee = {
    //     name: event.name,
    //     title: event.title
    //   }
    //   this.$emit('select-employee', employee)
    // }
  }
}
</script>

<style lang="scss" scoped></style>
