
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  showMenu = false;
  adminName = '';

  constructor(private router: Router) {
    // Récupérer le nom de l'admin connecté (exemple depuis localStorage)
    this.adminName = localStorage.getItem('adminName') || 'Admin';
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminName');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.showMenu = false;
  }

  editProfile() {
    // Rediriger vers la page de modification du profil (à implémenter)
    this.router.navigate(['/profil']);
    this.showMenu = false;
  }
}
