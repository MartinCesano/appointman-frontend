import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavigationEnd, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { UsuarioDTO } from '../../../models/usuario.dt';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  isLoginPage = true;
  usuarioActual: UsuarioDTO | null = null; // Aquí se reflejarán los cambios
  private subscription: Subscription = new Subscription(); // Para manejar la suscripción


  constructor(
    private router: Router,
    private authService: AuthService,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url === '/login' || event.url === '/register';
      }
    });
  }
  ngOnInit(): void {
    // Suscribirse al observable para escuchar los cambios
    this.subscription = this.authService.usuarioActual$.subscribe(
      (usuario) => {
        this.usuarioActual = usuario; // Actualizar la variable según los cambios
        console.log('Usuario actual:', this.usuarioActual);
      }
    );
  }

  ngOnDestroy(): void {
    // Asegurarse de limpiar la suscripción
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  
  openLogin(): void { 
    this.router.navigate(['/login']);
  }

  openRegister(): void {  
    this.router.navigate(['/register']);
  }

}


