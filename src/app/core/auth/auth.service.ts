import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { RegisterDTO } from '../../models/register-dto';
import axios  from 'axios';

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
}
