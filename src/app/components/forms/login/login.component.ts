import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { emailOrPhoneValidator } from '../../../validators/validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { 
    this.loginForm = this.formBuilder.group({
      identificador: ['', [Validators.required, emailOrPhoneValidator()]],
      contrasena: ['', Validators.required]
    });

    
  }
  async onSubmit(): Promise<void> {
    this.submitted=true
    if (this.loginForm.invalid) {
      return;
    }
    try {
      await this.authService.login(this.loginForm.value);
      alert('Sesion iniciada con exito');
      this.router.navigate(['/home']);
    } catch (error: any) {
      alert(error.error.message);

    }
  }

  



}
