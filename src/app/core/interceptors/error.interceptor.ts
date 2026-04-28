import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      console.error(error);

      let message = 'Ocurrió un error inesperado';

      // FastAPI
      if (error.error?.detail) {
        message = error.error.detail;
      }

      if (error.status === 0) {
        message = 'No hay conexión con el servidor';
      } else if (error.status === 401) {
        message = 'Sesión expirada. Inicia sesión nuevamente';
      } else if (error.status === 403) {
        message = 'No tienes permisos para esta acción';
      } else if (error.status === 404) {
        message = 'Recurso no encontrado';
      } else if (error.status >= 500) {
        message = 'Error interno del servidor';
      }

      toastr.error(message);

      return throwError(() => error); // 🔥 importante
    }),
  );
};
