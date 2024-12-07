import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService, 
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        telefono: ['', [Validators.required]],
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmarcontrasena: ['', [Validators.required]],
        roles: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required]],
        tipoDocumento: ['', [Validators.required]],
        documento: ['', [Validators.required]],
      },
      {
        validators: this.passwordsMatchValidator, // Validación de contraseñas
      }
    );
  }

  // Validador personalizado para comprobar que las contraseñas coinciden
  passwordsMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const contrasena = group.get('contrasena')?.value;
    const confirmarcontrasena = group.get('confirmarcontrasena')?.value;
    if (contrasena && confirmarcontrasena && contrasena !== confirmarcontrasena) {
      return { contrasenaMismatch: true }; // Usa 'contrasenaMismatch' como error
    }
    return null;
  }

  formatFecha(fecha: string): string {
    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }
  // Método que se ejecuta al enviar el formulario
  async onSubmit() {

    const registerDTO = {
      email: this.registerForm.value.email,
      contrasena: this.registerForm.value.contrasena,
      nombre: this.registerForm.value.nombre,
      apellido: this.registerForm.value.apellido,
      telefono: this.registerForm.value.telefono,
      rol: ["cliente"],
      fechaNacimiento: this.formatFecha(this.registerForm.value.fechaNacimiento),
      tipoDocumento: this.registerForm.value.tipoDocumento.toLowerCase(),
      documento: this.registerForm.value.documento,
    };
    console.log(this.registerForm.value);

    try {
      await this.authService.register(registerDTO);
      alert('Registro exitoso');
      this.router.navigate(['/login']);
    } catch (error) {
      alert(error);
    }
  }
}
