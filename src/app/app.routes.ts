import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/forms/login/login.component';
import { RegisterComponent } from './components/forms/register/register.component';

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
      { path: 'login', component: LoginComponent }, 
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' } ,
    ]
  },

  // Redirige rutas no válidas a /home
  { path: '**', redirectTo: 'home' } 
];
