import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroEntrada, RegistroSalida } from '../models/registro.model';

@Injectable({ providedIn: 'root' })
export class RegistroService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/registros';

  obtenerEstadoActual() {
    return this.http.get<{ activo: boolean }>(`${this.apiUrl}/estado`);
  }

  obtenerUbicacion(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { enableHighAccuracy: true },
      );
    });
  }

  entrada(payload: RegistroEntrada) {
    return this.http.post(`${this.apiUrl}/entrada`, payload);
  }

  registrarSalida(data: { lat: number; lng: number; motivo: string; observacion?: string }) {
    return this.http.post(`${this.apiUrl}/salida`, data);
  }
}
