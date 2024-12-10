import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RegisterDTO } from '../../models/register.dto';
import axios  from 'axios';
import { timer } from 'rxjs';
import moment from 'moment';
import { LoginDTO } from '../../models/login.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { TokenDTO } from '../../models/token.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  
  async register(body: RegisterDTO): Promise<void> {
    try {
      const response = await axios.post(`${environment.apiUrl}/auth/register`, body);
      return response.data;
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error
    }
  }

  async login (body: LoginDTO): Promise<void> {
    try {
      const response = await axios.post(`${environment.apiUrl}/auth/login`, body);
      localStorage.setItem('token', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      console.error('Error al loguearse:', error);
      throw error
    }
  }
  
  async refreshToken() {
    const tokenObject = JSON.parse(localStorage.getItem('token') ?? '{"refreshToken":""}');
    try {
      const response = (
        await axios.get(`${environment.apiUrl}/auth/refresh-token`, {
          headers: {
            'refresh-token': tokenObject.refreshToken,
          },
        })
      ).data;
      tokenObject.accessToken = response.accessToken;
      tokenObject.expirationTime = response.expirationTime;
      localStorage.setItem('token', JSON.stringify(tokenObject));
      this.scheduleTokenRefresh(response.expirationTime); // Ejecuta la función del refresh token para iniciar un nuevo ciclo
    }  catch (error) {
      alert('Error al refrescar el token');
      throw new HttpErrorResponse({ error });
    }
  }

  logout(): void {
    localStorage.removeItem('token');
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
      console.error('Expiration time is in the past');
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
      const response = await axios.post(`${environment.apiUrl}/auth/authorization`, {
        token: tokenObject.accessToken,
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }
}
