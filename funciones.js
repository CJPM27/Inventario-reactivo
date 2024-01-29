import { Producto } from "./clases/producto.js"
import { Alerta } from "./clases/alerta.js"

// Objeto con los diferentes mensajes disponibles
const mensajes = {
	agregado: "Has agregado el producto",
	editado: "Has editado el producto",
	confirmar: "Estas seguro que quieres eliminar el producto",
	eliminado: "Has eliminado el producto",
	errorDeBusqueda: "Ha ocurrido un error!",
	errorAlBuscar: "No se han encontrado resultados para tu búsqueda:",
	faltanDatos: "Rellene todos los campos del formulario"
}

// Funcion para generar un ID unico utilizando la fecha actual en milisegundos con un numero aleatorio
const generarID = () => {
	const a = Date.now().toString(30)
	const b = Math.random().toString(30).substring(2)
	return a + b
}

// Funcion para agregar un nuevo Producto
const agregarProducto = (objProducto, inventario) => {
	const { producto, categoria, modelo, talla, marca, cantidad, precio } =
		objProducto
	const id = generarID()

	const product = new Producto(
		id,
		producto,
		categoria,
		modelo,
		talla,
		marca,
		cantidad,
		precio
	)

	product.obtenerTotal()

	inventario.push(product)

	guardarInventarioEnLS(inventario)

	return inventario
}

// Funcion para editar un Producto
const editarProducto = (objProducto, instancia, inventario) => {
	const index = inventario.findIndex(product => product.id === instancia.id)

	if (index !== -1) {
		instancia.editarProducto(objProducto)

		instancia.obtenerTotal()

		inventario[index] = instancia

		guardarInventarioEnLS(inventario)

		return inventario
	}
}

// Funcion para crear una Alerta
const lanzarAlerta = (opcionMsg, icon, value = null) => {
	const alerta = new Alerta(mensajes[opcionMsg], icon, value)

	alerta.crearAlerta()
}

// Funcion para guardar el inventario en LocalStorage
const guardarInventarioEnLS = inventario => {
	localStorage.removeItem("Inventario")
	localStorage.setItem("Inventario", JSON.stringify(inventario))
}

// Funcion para obtener el Inventario Inicial
const insertarInventarioInicial = async () => {
	let inventario = localStorage.getItem("Inventario")

	if (inventario === null) {
		inventario = []
		const productosEnInventario = await fetch("./storage/storage.json")
			.then(value => value.json())
			.then(value => value.inventario)

		productosEnInventario.forEach(objProducto => {
			const { producto, categoria, modelo, talla, marca, cantidad, precio } =
				objProducto
			const id = generarID()

			const product = new Producto(
				id,
				producto,
				categoria,
				modelo,
				talla,
				marca,
				cantidad,
				precio
			)

			product.obtenerTotal()

			inventario.push(product)
		})
		guardarInventarioEnLS(inventario)
	}
}

// Funcion para obtener el inventario que hay en LocalStorage
const obtenerInventarioDeLS = () => {
	const inventarioJSON = localStorage.getItem("Inventario")

	const inventario = JSON.parse(inventarioJSON)

	if (inventario) {
		const inventarioConInstancias = inventario.map(producto =>
			Producto.instanciarObjeto(producto)
		)
		inventarioConInstancias.map(producto => producto.obtenerTotal())
		return inventarioConInstancias
	}

	return []
}

// Funcion para editar un producto del inventario del localStorage
const editarProductoDeLS = (producto, inventario) => {
	const index = inventario.findIndex(product => product.id === producto)

	if (index !== -1) {
		inventario[index] = producto

		guardarInventarioEnLS(inventario)

		return inventario
	}
}

// Funcion para eliminar un producto del inventario del localStorage
const borrarProductoDeLS = (producto, inventario) => {
	const index = inventario.findIndex(product => product.id === producto)

	if (index !== -1) {
		inventario.splice(index, 1)

		guardarInventarioEnLS(inventario)

		return inventario
	}
}

// Funcion para maquetar la tabla
const template = producto => {
	producto.obtenerTotal()

	return `
   <tr class="articulos filtro-busqueda">
   <td class="nombre-producto">${producto.producto}</td>
   <td class="categoria-producto">${producto.categoria}</td>
   <td class="modelo-producto">${producto.modelo}</td>
   <td class="talla-producto">${producto.talla}</td>
   <td class="marca-producto">${producto.marca}</td>
   <td >${producto.cantidad}</td>
   <td>${producto.precio} $</td>
   <td>${producto.total} $</td>
   <td>
      <button id="${producto.id}" type="button" class="btnEdit btn btn-outline-warning btn-sm border-0 fs-5" data-bs-toggle="modal" data-bs-target="#modalEdit">
         <i class="fa-solid fa-pencil"></i>
      </button>
      <button id="${producto.id}" type="button" class="btnDelete btn btn-outline-danger btn-sm border-0 fs-5">
         <i class="fa-solid fa-trash"></i>
      </button>
   </td>
 </tr>`
}

// Funcion para maquetar el formulario de editar producto
const templateModal = producto => {
	console.log(producto)
	const inputName = document.getElementById("productoEdit")
	inputName.value = producto.producto
	const inputModelo = document.getElementById("modeloEdit")
	inputModelo.value = producto.modelo
	const inputCategoria = document.getElementById("categoriaEdit")
	inputCategoria.value = producto.categoria
	let eventoChange = new Event("change")
	inputCategoria.dispatchEvent(eventoChange)
	const inputTalla = document.getElementById("tallaEdit")
	inputTalla.value = producto.talla
	const inputMarca = document.getElementById("marcaEdit")
	inputMarca.value = producto.marca
	const inputCantidad = document.getElementById("cantidadEdit")
	inputCantidad.value = producto.cantidad
	const inputPrecio = document.getElementById("precioEdit")
	inputPrecio.value = producto.precio
	const editID = document.getElementById("editID")
	editID.textContent = producto.id
}

const render = () => {
	const productos = obtenerInventarioDeLS()
	const tbody = document.getElementById("tbody")
	tbody.innerHTML = productos.map(producto => template(producto)).join("")

	const botones = document.querySelectorAll(".btnDelete")
	botones.forEach(boton => {
		boton.addEventListener("click", () => {
			let inventarioActualizado = obtenerInventarioDeLS()
			borrarProductoDeLS(boton.id, inventarioActualizado)
			render()
			lanzarAlerta("eliminado", "success")
		})
	})

	const botonesEdit = document.querySelectorAll(".btnEdit")
	botonesEdit.forEach(boton => {
		boton.addEventListener("click", () => {
			let inventarioActualizado = obtenerInventarioDeLS()
			const index = inventarioActualizado.findIndex(
				product => product.id === boton.id
			)
			templateModal(inventarioActualizado[index])
		})
	})
}

// Funcion para filtrar las opciones de tallas
function showTallaInputEdit() {
	let categoria = document.getElementById("categoriaEdit").value
	let tallaContainer = document.getElementById("tallaContainerEdit")
	let marcaContainer = document.getElementById("marcaContainerEdit")
	let cantidadContainer = document.getElementById("cantidadContainerEdit")
	let precioContainer = document.getElementById("precioContainerEdit")

	document.getElementById("talla").innerHTML = ""

	if (categoria === "Botas") {
		tallaContainer.classList.remove("d-none")
		marcaContainer.classList.remove("d-none")
		cantidadContainer.classList.remove("d-none")
		precioContainer.classList.remove("d-none")

		let tallas = [
			"29",
			"30",
			"32",
			"34",
			"36",
			"37",
			"38",
			"39",
			"40",
			"41",
			"42",
			"43",
			"44",
			"45"
		]
		addTallaOptionsEdit(tallas)
	} else if (categoria === "Franela") {
		tallaContainer.classList.remove("d-none")
		marcaContainer.classList.remove("d-none")
		cantidadContainer.classList.remove("d-none")
		precioContainer.classList.remove("d-none")

		let tallas = ["S", "M", "L", "XL", "XXL"]
		addTallaOptionsEdit(tallas)
	} else if (categoria === "Pantalon") {
		tallaContainer.classList.remove("d-none")
		marcaContainer.classList.remove("d-none")
		cantidadContainer.classList.remove("d-none")
		precioContainer.classList.remove("d-none")

		let tallas = [
			"16",
			"18",
			"20",
			"22",
			"24",
			"26",
			"28",
			"30",
			"32",
			"34",
			"36",
			"38",
			"40"
		]
		addTallaOptionsEdit(tallas)
	} else {
		tallaContainer.classList.add("d-none")
		marcaContainer.classList.add("d-none")
		cantidadContainer.classList.add("d-none")
		precioContainer.classList.add("d-none")
	}
}

// Funcion para agregar las opciones de tallas
function addTallaOptionsEdit(tallas) {
	let tallaSelect = document.getElementById("tallaEdit")

	tallaSelect.options.length = 0

	for (let i = 0; i < tallas.length; i++) {
		let option = document.createElement("option")
		option.text = tallas[i]
		option.value = tallas[i]
		tallaSelect.add(option)
	}
}

export {
	agregarProducto,
	editarProducto,
	lanzarAlerta,
	guardarInventarioEnLS,
	insertarInventarioInicial,
	obtenerInventarioDeLS,
	editarProductoDeLS,
	borrarProductoDeLS,
	render,
	templateModal,
	showTallaInputEdit
}
