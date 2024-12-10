import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { atLeastOneRequiredValidator, birthDateValidator, passwordsMatchValidator } from '../../../validators/validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted = false; 

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group(
      {
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        fechaNacimiento: ['', Validators.required ],
        tipoDocumento: ['', Validators.required],
        documento: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        email: ['', Validators.email],
        telefono: ['', Validators.pattern(/^\+?\d{7,15}$/)],
        contrasena: ['', [Validators.required, Validators.minLength(8)]],
        confirmarcontrasena: ['', Validators.required],
      },
      {
        validators: [atLeastOneRequiredValidator, passwordsMatchValidator, birthDateValidator],
      }
    );
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
    this.submitted = true;

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
      if (!this.registerForm.valid) {
        throw new Error('El formulario no es válido. Por favor, revise los campos e intente nuevamente.');
      }
      await this.authService.register(registerDTO);
      alert('Registro exitoso');
      this.router.navigate(['/login']);
    } catch (error: any) {
      alert(error.error.message);
    }
  }
}
