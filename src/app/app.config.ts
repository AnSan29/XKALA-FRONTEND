// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // Requerido para que los Toast funcionen con animaciones
    provideAnimations(),

    // Configuración global de las notificaciones
    provideToastr({
      timeOut: 4000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
    }),

    // Registro de HttpClient con los interceptores en ORDEN
    provideHttpClient(
      withInterceptors([
        authInterceptor, // 1. Agrega el Token a la cabecera
        errorInterceptor, // 2. Captura errores y muestra el Toast
      ]),
    ),
  ],
};
