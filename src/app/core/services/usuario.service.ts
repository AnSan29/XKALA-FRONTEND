import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/usuarios';

  getUsuarioActual() {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }
}
