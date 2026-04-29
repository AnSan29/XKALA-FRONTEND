// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { AsistenciaComponent } from './features/asistencia/asistencia.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Importación directa
  { path: 'asistencia', component: AsistenciaComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
