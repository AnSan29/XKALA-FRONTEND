import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../../core/services/registro.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private registroService = inject(RegistroService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  estaRegistrado = false; // Esto podrías consultarlo al back al iniciar

  eppStatus: any = { casco: false, gafas: false, reflectivo: false, botas: false, arnes: false };
  eppItems = [
    { id: 'casco', label: 'Casco de Seguridad' },
    { id: 'gafas', label: 'Gafas de Protección' },
    { id: 'reflectivo', label: 'Chaleco Reflectivo' },
    { id: 'botas', label: 'Botas de Seguridad' },
    { id: 'arnes', label: 'Arnés de Altura' },
  ];

  salidaData = { motivo: 'finalizacion', observacion: '' };

  ngOnInit() {
    this.verificarSesionActiva();
  }

  verificarSesionActiva() {
    this.loading = true;
    this.registroService.obtenerEstadoActual().subscribe({
      next: (res) => {
        this.estaRegistrado = res.activo; // Si el back dice true, mostramos Salida
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Si falla, por seguridad asumimos que no está registrado
        this.estaRegistrado = false;
      },
    });
  }

  async marcarEntrada() {
    try {
      this.loading = true;
      const coords = await this.registroService.obtenerUbicacion();

      const payload = {
        lat: coords.lat,
        lng: coords.lng,
        epp: this.eppStatus,
      };

      this.registroService.entrada(payload).subscribe({
        next: () => {
          this.estaRegistrado = true;
          this.loading = false;
          alert('Entrada registrada con éxito');
        },
        error: (err) => {
          this.loading = false;
          alert(err.error?.detail || 'Error al registrar entrada');
        },
      });
    } catch (error) {
      this.loading = false;
      alert('Debes permitir la ubicación para registrar tu entrada.');
    }
  }

  async marcarSalida() {
    try {
      this.loading = true;
      const coords = await this.registroService.obtenerUbicacion();

      // Armamos el payload exacto que espera tu RegistroSalida (Pydantic)
      const payload = {
        lat: coords.lat,
        lng: coords.lng,
        motivo: this.salidaData.motivo,
        observacion: this.salidaData.observacion,
      };

      this.registroService.registrarSalida(payload).subscribe({
        next: () => {
          this.estaRegistrado = false;
          this.loading = false;
          alert('Salida registrada exitosamente. ¡Buen descanso!');
        },
        error: (err) => {
          this.loading = false;
          // Mostramos el detalle del error que viene de FastAPI (raise HTTPException)
          alert(err.error?.detail || 'Error al registrar salida');
        },
      });
    } catch (error) {
      this.loading = false;
      alert('Error al obtener la ubicación para la salida.');
    }
  }

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
