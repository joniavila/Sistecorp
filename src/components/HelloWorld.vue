<template>
	<v-container>
		<v-layout text-center wrap>
			<v-flex xs12>
				<v-img
					:src="require('../assets/logoSistecorp.jpg')"
					class="my-3"
					contain
					height="100"
				></v-img>
			</v-flex>

			<v-flex mb-4>
				<h1 class="display-2 font-weight-bold mb-3">
					Bienvenido
				</h1>
				<p class="subheading font-weight-regular">
				</p>
			</v-flex>

			<v-flex mb-5 xs12>
				<h2 class="headline font-weight-bold mb-3">Sobre nosotros:</h2>
					SISTECORP  es una empresa constituida en el año 2008 con el objetivo de comercializar
				equipos e insumos informáticos a empresas y comercios de la ciudad de Cordoba.
				Con el correr del tiempo, y con el objetivo de satisfacer todas las necesidades de compras
				indirectas de nuestros clientes, se fueron incorporando nuevas marcas, productos y servicios
				que hoy forman parte de nuestro abanico de soluciones.
				Desde el año 2014 contamos con un equipo de técnicos instaladores que nos permiten brindar
				una solución integral y a medida de las necesidades de crecimiento y modernización de cada cliente.
				Al día de hoy continuamos mejorando y creciendo con el objetivo de brindar a las empresas
				un servicio con el más alto nivel de calidad.
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
export default {
	data: () => ({
	})
}
</script>
