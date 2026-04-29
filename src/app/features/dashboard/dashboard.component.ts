import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { RegistroService } from '../../core/services/registro.service';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';

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
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  loading = false;
  estaRegistrado = false;
  panelOpen = false;

  usuario: any = null;

  eppStatus: any = {
    casco: false,
    gafas: false,
    reflectivo: false,
    botas: false,
    arnes: false,
  };

  eppItems = [
    { id: 'casco', label: 'Casco de Seguridad' },
    { id: 'gafas', label: 'Gafas de Protección' },
    { id: 'reflectivo', label: 'Chaleco Reflectivo' },
    { id: 'botas', label: 'Botas de Seguridad' },
    { id: 'arnes', label: 'Arnés de Altura' },
  ];

  salidaData = {
    motivo: 'finalizacion',
    observacion: '',
  };

  ngOnInit() {
    this.verificarSesionActiva();
    this.cargarUsuario();
  }

  // ===============================
  // 👤 USUARIO
  // ===============================
  cargarUsuario() {
    this.usuarioService.getUsuarioActual().subscribe({
      next: (res) => {
        this.usuario = res;
      },
      error: () => {
        this.usuario = null;
        this.toastr.warning('No se pudo cargar el usuario');
      },
    });
  }

  // ===============================
  // 🔄 UI
  // ===============================
  togglePanel() {
    this.panelOpen = !this.panelOpen;
  }

  // ===============================
  // 📊 ESTADO SESIÓN
  // ===============================
  verificarSesionActiva() {
    this.loading = true;

    this.registroService.obtenerEstadoActual().subscribe({
      next: (res) => {
        this.estaRegistrado = res.activo;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.estaRegistrado = false;
        // interceptor ya muestra error
      },
    });
  }

  // ===============================
  // 🟢 ENTRADA
  // ===============================
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
          this.panelOpen = false;

          this.toastr.success('Entrada registrada correctamente');
        },
        error: () => {
          this.loading = false;
          // interceptor maneja error
        },
      });
    } catch (error) {
      this.loading = false;
      this.toastr.warning('Debes permitir la ubicación');
    }
  }

  // ===============================
  // 🔴 SALIDA
  // ===============================
  async marcarSalida() {
    try {
      this.loading = true;

      const coords = await this.registroService.obtenerUbicacion();

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
          this.panelOpen = false;

          this.toastr.info('Salida registrada correctamente');
        },
        error: () => {
          this.loading = false;
        },
      });
    } catch (error) {
      this.loading = false;
      this.toastr.error('No se pudo obtener la ubicación');
    }
  }

  // ===============================
  // 🔐 LOGOUT
  // ===============================
  cerrarSesion() {
    this.authService.logout();
    this.toastr.info('Sesión cerrada');
    this.router.navigate(['/login']);
  }
}
