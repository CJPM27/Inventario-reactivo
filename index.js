import {
	agregarProducto,
	editarProducto,
	lanzarAlerta,
	render,
	insertarInventarioInicial,
	obtenerInventarioDeLS,
  showTallaInputEdit
} from "./funciones.js"

// Inicio el inventario
const d = document

// Creamos la tabla de productos
d.addEventListener("DOMContentLoaded", async () => {
	await insertarInventarioInicial()
	render()
})

// Obtengo el select de las categorias
let categoria = document.getElementById("categoria")

// Creo un evento en el select
// Cada que se produzca un cambio muestro las tallas correspondientes
categoria.addEventListener("change", showTallaInput)

// Obtengo el select de las categorias
let categoriaEdit = document.getElementById("categoriaEdit")

// Creo un evento en el select
// Cada que se produzca un cambio muestro las tallas correspondientes
categoriaEdit.addEventListener("change", showTallaInputEdit)

const inputBusqueda = document.getElementById("input-busqueda")
inputBusqueda.addEventListener("input", function (event) {
	event.preventDefault()
	const valorBusqueda = inputBusqueda.value.toLowerCase()
	filtrarElementos(valorBusqueda)
})

// Función para filtrar la búsqueda que haga el usuario
function filtrarElementos(valorBusqueda) {
	const elementos = document.querySelectorAll(".articulos.filtro-busqueda")
	let contador = 0
	elementos.forEach(elemento => {
		const textoProducto = elemento
			.querySelector(".nombre-producto")
			.textContent.toLowerCase()
		const textoCategoria = elemento
			.querySelector(".categoria-producto")
			.textContent.toLowerCase()
		const textoModelo = elemento
			.querySelector(".modelo-producto")
			.textContent.toLowerCase()
		const textoTalla = elemento
			.querySelector(".talla-producto")
			.textContent.toLowerCase()
		const textoMarca = elemento
			.querySelector(".marca-producto")
			.textContent.toLowerCase()

		if (
			textoProducto.includes(valorBusqueda) ||
			textoCategoria.includes(valorBusqueda) ||
			textoModelo.includes(valorBusqueda) ||
			textoTalla.includes(valorBusqueda) ||
			textoMarca.includes(valorBusqueda)
		) {
			elemento.style.display = ""
			contador += 1
		} else {
			elemento.style.display = "none"
		}
	})
	return contador
}

// Funcion para filtrar las opciones de tallas
function showTallaInput() {
	let categoria = document.getElementById("categoria").value
	let tallaContainer = document.getElementById("tallaContainer")
	let marcaContainer = document.getElementById("marcaContainer")
	let cantidadContainer = document.getElementById("cantidadContainer")
	let precioContainer = document.getElementById("precioContainer")

	document.getElementById("talla").innerHTML = ""

	if (categoria === "Botas") {
		tallaContainer.classList.remove("d-none")
		marcaContainer.classList.remove("d-none")
		cantidadContainer.classList.remove("d-none")
		precioContainer.classList.remove("d-none")

		let tallas = ["29", "30", "32", "34", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45"]
		addTallaOptions(tallas)
	} else if (categoria === "Franela") {
		tallaContainer.classList.remove("d-none")
		marcaContainer.classList.remove("d-none")
		cantidadContainer.classList.remove("d-none")
		precioContainer.classList.remove("d-none")

		let tallas = ["S", "M", "L", "XL", "XXL"]
		addTallaOptions(tallas)
	} else if (categoria === "Pantalon") {
		tallaContainer.classList.remove("d-none")
		marcaContainer.classList.remove("d-none")
		cantidadContainer.classList.remove("d-none")
		precioContainer.classList.remove("d-none")

		let tallas = ["22", "24", "26", "28", "30", "32", "34", "36", "38", "40"]
		addTallaOptions(tallas)
	} else {
		tallaContainer.classList.add("d-none")
		marcaContainer.classList.add("d-none")
		cantidadContainer.classList.add("d-none")
		precioContainer.classList.add("d-none")
	}
}

// Funcion para agregar las opciones de tallas
function addTallaOptions(tallas) {
	let tallaSelect = document.getElementById("talla")

	for (let i = 0; i < tallas.length; i++) {
		let option = document.createElement("option")
		option.text = tallas[i]
		option.value = tallas[i]
		tallaSelect.add(option)
	}
}

const formulario = d.getElementById("registrarProductos")
// Evento para agregar un producto
formulario.addEventListener("submit", e => {
	e.preventDefault()
	let producto = d.getElementById("producto")
	let precio = d.getElementById("precio")
	let cantidad = d.getElementById("cantidad")
	let talla = d.getElementById("talla")
	let marca = d.getElementById("marca")
	let modelo = d.getElementById("modelo")

	if (
		producto.value &&
		precio.value &&
		cantidad.value &&
		talla.value &&
		marca.value &&
		modelo.value
	) {
		const productoObj = {
			producto: producto.value,
			categoria: categoria.value,
			modelo: modelo.value,
			talla: talla.value,
			marca: marca.value,
			cantidad: cantidad.value,
			precio: precio.value
		}
		let inventario = obtenerInventarioDeLS()
		const nuevoInventario = agregarProducto(productoObj, inventario)
		lanzarAlerta("agregado", "success")
		inventario = nuevoInventario
		render()
		producto.value = ""
		precio.value = ""
		categoria.value = ""
		cantidad.value = ""
		talla.value = ""
		marca.value = ""
		modelo.value = ""
	} else {
		lanzarAlerta("faltanDatos", "warning")
	}
})

const formularioEdit = d.getElementById("editarProducto")
// Evento para editar un producto
formularioEdit.addEventListener("submit", e => {
	e.preventDefault()
	const editID = document.getElementById('editID').textContent
	let producto = d.getElementById("productoEdit")
	let precio = d.getElementById("precioEdit")
	let cantidad = d.getElementById("cantidadEdit")
	let talla = d.getElementById("tallaEdit")
	let marca = d.getElementById("marcaEdit")
	let modelo = d.getElementById("modeloEdit")

	if (
		producto.value &&
		precio.value &&
		cantidad.value &&
		talla.value &&
		marca.value &&
		modelo.value
	) {
    
		const productoObj = {
			producto: producto.value,
			categoria: categoriaEdit.value,
			modelo: modelo.value,
			talla: talla.value,
			marca: marca.value,
			cantidad: cantidad.value,
			precio: precio.value
		}
		let inventario = obtenerInventarioDeLS()
    const instancia = inventario.find(producto => producto.id == editID)
		const nuevoInventario = editarProducto(productoObj, instancia, inventario)
		lanzarAlerta("editado", "success")
		inventario = nuevoInventario
		render()
	} else {
		lanzarAlerta("faltanDatos", "warning")
	}
})

const formularioBuscar = d.getElementById("buscarProductos")
// Evento para buscar un producto y lanzar una alerta en caso de haber un error
formularioBuscar.addEventListener("submit", e => {
	e.preventDefault()
	const valorBusqueda = inputBusqueda.value.toLowerCase()
	const filter = filtrarElementos(valorBusqueda)
	if (filter === 0) {
		lanzarAlerta('errorAlBuscar', 'warning', valorBusqueda)
	}
})