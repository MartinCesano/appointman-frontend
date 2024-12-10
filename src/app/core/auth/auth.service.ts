import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RegisterDTO } from '../../models/register.dto';
import axios from 'axios';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import moment from 'moment';
import { LoginDTO } from '../../models/login.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenDTO } from '../../models/token.dto';
import { UsuarioDTO } from '../../models/usuario.dt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Sujeto privado para controlar el estado
  private usuarioActualSubject = new BehaviorSubject<UsuarioDTO | null>(null);

  // Observable público para que los componentes lo observen
  usuarioActual$: Observable<UsuarioDTO | null> = this.usuarioActualSubject.asObservable();

  constructor() {
    this.restoreSession(); // Restaurar sesión al inicializar
  }

  private async restoreSession(): Promise<void> {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const usuario = await this.getUser(); // Obtén los datos del usuario
        this.setUsuarioActual(usuario);
      } catch (error) {
        console.error('Error al restaurar la sesión:', error);
        this.logout();
      }
    }
  }

  async register(body: RegisterDTO): Promise<void> {
    try {
      const response = await axios.post(`${environment.apiUrl}/auth/register`, body);
      return response.data;
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error
    }
  }

  async login(body: LoginDTO): Promise<void> {
    try {
      const response = await axios.post(`${environment.apiUrl}/auth/login`, body);
      localStorage.setItem('token', JSON.stringify(response.data));
      this.scheduleTokenRefresh(response.data.expirationTime);
      this.isTokenValid();
      const usuario = await this.getUser();
      this.setUsuarioActual(usuario);
      return response.data;
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.error('Error al loguearse:', error);
      throw error
    }
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }


  // Método para actualizar el estado del usuario
  setUsuarioActual(usuario: UsuarioDTO | null): void {
    this.usuarioActualSubject.next(usuario);
  }

  // Método para obtener el valor actual del usuario
  getUsuarioActual(): UsuarioDTO | null {
    return this.usuarioActualSubject.value;
  }

  async refreshToken() {
    const tokenObject = JSON.parse(localStorage.getItem('token') ?? '{"refreshToken":""}');
    try {
      const response = (
        await axios.get(`'${environment.apiUrl}/auth/refresh-token'`, {
          headers: {
            'refresh-token': tokenObject.refreshToken,
          },
        })
      ).data;
      tokenObject.accessToken = response.accessToken;
      tokenObject.expirationTime = response.expirationTime;
      localStorage.setItem('token', JSON.stringify(tokenObject));
      this.scheduleTokenRefresh(response.expirationTime); // Ejecuta la función del refresh token para iniciar un nuevo ciclo
    } catch (error) {
      alert('Error al refrescar el token');
      throw new HttpErrorResponse({ error });
    }
  }


  private scheduleTokenRefresh(expirationTime: string): void {
    const currentTime = moment();
    const expirationMoment = moment(expirationTime);
    const timeToExpire = expirationMoment.diff(currentTime);
    if (timeToExpire > 0) {
      const refreshTime = timeToExpire * 0.5; // Se cambia a 0.5 para refrescar a mitad del tiempo
      timer(refreshTime).subscribe(async () => {
        await this.refreshToken();
      });
    } else {
      console.error('El token está expirado');
    }
  }

  public initializeTokenRefresh(): void {
    const tokenString = localStorage.getItem('token'); // Obtiene el token del local storage
    if (tokenString) {
      const tokenObject = JSON.parse(tokenString) as TokenDTO; // Lo transforma a objeto
      const expirationTime = tokenObject.expirationTime; // Consigue el tiempo de expiración
      if (expirationTime) {
        this.scheduleTokenRefresh(expirationTime); // Ejecuta la función del ciclo de refreshToken
      }
    }
  }

  async isTokenValid(): Promise<boolean> {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      return false;
    }
    const tokenObject = JSON.parse(tokenString) as TokenDTO;
    try {
      console.log('Validando token');
      const response = await axios.get(
        `${environment.apiUrl}/auth/validar`,
        {
          headers: {
            Authorization: `Bearer ${tokenObject.accessToken}`,
          },
        }
      );
      console.log('Es valido token');
      return response.data.valid;
    } catch (error) {
      console.error('Error al validar el token:', error);
      return false;
    }
  }


  isLoggedIn(): boolean {
    if (typeof localStorage === 'undefined') {
      return false; // localStorage no está disponible
    }
    const token = localStorage.getItem('token');
    const isLogged = !!token;
    return isLogged;
  }

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

