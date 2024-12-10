import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { NavigationEnd, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { UsuarioDTO } from '../../models/usuario.dt';
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
  private authSubscription!: Subscription; // Subscripción para manejar el observable
  isLoggedIn: boolean = false;
  isLoginPage = true;
  usuarioActual: UsuarioDTO | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url === '/login' || event.url === '/register';
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.authSubscription = this.authService.loggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = this.authService.isLoggedIn();
    });
    if (this.isLoggedIn) {
      this.usuarioActual = await this.usuarioService.getUser();
    }
  }
  ngOnDestroy() {
    // Cancelar la suscripción para evitar fugas de memoria
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  openLogin(): void { 
    this.router.navigate(['/login']);
  }

  openRegister(): void {  
    this.router.navigate(['/register']);
  }

  logout(): void {
    this.authService.logout();  
    this.router.navigate(['/login']);
  }
}


