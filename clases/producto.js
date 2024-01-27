// Clase para instanciar un producto a manipular
class Producto{
   constructor(id, producto, categoria, modelo, talla, marca, cantidad, precio){
      this.id = id;
      this.producto = producto;
      this.categoria = categoria;
      this.modelo = modelo
      this.talla = talla;
      this.marca = marca;
      this.cantidad = cantidad;
      this.precio = precio;
      this.total = 0
   }

   // Metodo para obtener el precio total del producto en inventario
   obtenerTotal(){
      this.total = this.cantidad * this.precio
   }

   // Metodo estatico para instanciar un objeto
   static instanciarObjeto(objeto){
      return new Producto(
         objeto.id,
         objeto.producto,
         objeto.categoria,
         objeto.modelo,
         objeto.talla,
         objeto.marca,
         objeto.cantidad,
         objeto.precio
      );
   }

   // Metodo para editar un producto en inventario
   editarProducto(producto){
      if(producto?.producto) this.producto = producto.producto
      if(producto?.categoria) this.categoria = producto.categoria
      if(producto?.modelo) this.modelo = producto.modelo
      if(producto?.talla) this.talla = producto.talla
      if(producto?.marca) this.marca = producto.marca
      if(producto?.cantidad) this.cantidad = producto.cantidad
      if(producto?.precio) this.precio = producto.precio
   }
}

export {Producto}