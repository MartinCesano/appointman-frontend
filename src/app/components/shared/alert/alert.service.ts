// alert.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  // Método para mostrar alertas de éxito
  alertExito(message: string, title: string = '¡Éxito!') {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  }

  // Método para mostrar alertas de error
  alertError(message: string, title: string = 'Error') {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  }

  // Método para mostrar alertas de advertencia
  showWarning(message: string, title: string = 'Advertencia') {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  }

  // Método para mostrar alertas de información
  alertInfo(message: string, title: string = 'Información') {
    Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      timer: 2000,
      showConfirmButton: false
    });
  }
}
