// user.service.ts
import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/environment';
import { UsuarioDTO } from '../../models/usuario.dt';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private authService: AuthService) { }

  // Método para obtener los datos del usuario logueado
  async getUser(): Promise<UsuarioDTO | null> {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      return null; // Si no hay token, no hay usuario
    }
    
    const tokenObject = JSON.parse(tokenString);
    try {
      const response = await axios.get(`${environment.apiUrl}/usuario/me`, {
        headers: {
          Authorization: `Bearer ${tokenObject.accessToken}`,
        }
      });
      // Guardamos la información del usuario en el localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error al obtener los datos del usuario:', error);
      return null;
    }
  }


}
