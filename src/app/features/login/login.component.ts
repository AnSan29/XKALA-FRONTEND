import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // <-- CRUCIAL
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // <-- DEBE ESTAR AQUÍ
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  loginForm: FormGroup = this.fb.group({
    documento: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  loading = false;
  error = '';

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const { documento, password } = this.loginForm.value;

    this.authService.login(documento, password).subscribe({
      next: (res) => {
        // Si el login es exitoso, el loading se apaga y redirigimos
        this.loading = false;
        this.router.navigate(['/welcome']);
      },
      error: (err) => {
        // IMPORTANTE: Aquí apagamos el loading si hay error
        this.loading = false;
        console.error(err);

        // Manejo de mensajes de error desde FastAPI
        if (err.status === 401 || err.status === 400) {
          this.error = 'Documento o contraseña incorrectos';
        } else {
          this.error = 'Error de conexión con el servidor';
        }
      },
    });
  }
}
