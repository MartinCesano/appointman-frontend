import { Component, Input } from '@angular/core';
import { NAVBAR_OPTIONS } from './navbar-options';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


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

  ngOnInit() {
    // Carga las opciones basadas en el rol o muestra las opciones por defecto
    this.options = NAVBAR_OPTIONS[this.role] || NAVBAR_OPTIONS['sinRol'];
  }
}
