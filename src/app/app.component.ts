import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin-dashboard';
  currentUrl = '';

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      this.currentUrl = event.url;
    });
  }

  isLoginPage() {
    // Affiche la page login SANS navbar/sidebar uniquement si l'URL est exactement '/login' ou '/login/'
    return this.currentUrl === '/login' || this.currentUrl === '/login/';
  }
}
