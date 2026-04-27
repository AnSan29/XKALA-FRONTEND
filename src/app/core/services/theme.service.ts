import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private currentTheme: 'light' | 'dark' = 'light';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    // Carga el tema guardado al iniciar
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.setTheme(savedTheme);
    }
  }

  setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    // Bootstrap 5.3+: aplica el tema al tag html
    this.renderer.setAttribute(document.documentElement, 'data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
  }

  isDarkMode(): boolean {
    return this.currentTheme === 'dark';
  }
}
