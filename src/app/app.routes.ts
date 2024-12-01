import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    // Layou component es  el componente que 
    // ordena la estructura de la pagina
    component: LayoutComponent, 
    // Layout siempre visible
    // Los hijos de layout son las paginas 
    // de contenido que se pueden navegar
    // a traves del sidebar
    children: [
      { path: 'home', component: HomeComponent }, 
      { path: '', redirectTo: 'home', pathMatch: 'full' } 
    ]
  },
  // Redirige rutas no válidas a /home
  { path: '**', redirectTo: 'home' } 
];
