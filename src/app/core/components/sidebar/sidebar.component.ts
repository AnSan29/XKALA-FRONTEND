import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  public themeService = inject(ThemeService);
  private toastr = inject(ToastrService);

  isOpen = true;

  ngOnInit() {
    // En móvil inicia cerrado, en desktop abierto
    if (window.innerWidth < 768) {
      this.isOpen = false;
    }
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  logout() {
    this.authService.logout();
    this.toastr.info('Sesión cerrada');
    this.router.navigate(['/login']);
  }
}
