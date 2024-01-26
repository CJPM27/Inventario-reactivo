// Clase para instanciar una alerta
class Alerta{
   constructor(mensaje,icon, valor = null){
      this.mensaje = mensaje;
      this.icon=icon;
      this.valor = valor;
   }

   // Metodo para obtener el mensaje de la alerta
   crearAlerta(){
      if(this.valor !== null){
         this.mensaje = `${this.mensaje} ${this.valor}`
      }

      Swal.fire({
         position: "center",
         icon: `${this.icon}`,
         title: this.mensaje,
         showConfirmButton: false,
         timer: 2000,
      });
   }

}

export { Alerta }