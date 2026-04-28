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

    const { documento, password } = this.loginForm.value;

    this.authService.login(documento, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/welcome']);
      },
      error: () => {
        this.loading = false;
        // ❌ NO manejar mensajes aquí
        // interceptor ya lo hizo
      },
    });
  }
}
