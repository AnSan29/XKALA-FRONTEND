import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/auth';

  login(documento: string, password: string) {
    return this.http
      .post<{ access_token: string }>(`${this.apiUrl}/login`, { documento, password })
      .pipe(tap((res) => localStorage.setItem('token', res.access_token)));
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
