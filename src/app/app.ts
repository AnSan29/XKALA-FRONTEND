import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './core/components/sidebar/sidebar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  template: `
    <div class="d-flex" id="wrapper">
      <app-sidebar *ngIf="authService.isLoggedIn()"></app-sidebar>

      <div
        id="page-content-wrapper"
        [class.w-100]="!authService.isLoggedIn()"
        class="bg-light p-4 overflow-auto"
      >
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [
    `
      #wrapper {
        overflow-x: hidden;
        min-height: 100vh;
      }
      #page-content-wrapper {
        flex: 1;
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class AppComponent {
  authService = inject(AuthService);
}
