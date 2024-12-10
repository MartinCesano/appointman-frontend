import { Component, Input } from '@angular/core';
import { NAVBAR_OPTIONS } from './navbar-options';
import { CommonModule } from '@angular/common';
import { RouterModule, Router} from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { UsuarioDTO } from '../../../models/usuario.dt';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() role: 'cliente' | 'empleado' | 'emprendedor' | 'sinRol' = 'emprendedor';
  options: { label: string; link: string; }[] = [];
  isLoggedIn: boolean = false;  
  isLoginPage = true;
  usuarioActual: UsuarioDTO | null = null; // Aquí se reflejarán los cambios
  private subscription: Subscription = new Subscription(); // Para manejar la suscripción

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    // Carga las opciones basadas en el rol o muestra las opciones por defecto
    this.options = NAVBAR_OPTIONS[this.role] || NAVBAR_OPTIONS['sinRol'];

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
  logout(): void {
    this.authService.logout();  
    this.router.navigate(['/login']);
  }
}
