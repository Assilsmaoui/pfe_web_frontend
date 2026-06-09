import { Component, HostListener, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  showMenu = false;
  adminName = '';

  constructor(
    private router: Router,
    private eRef: ElementRef
  ) {
    this.adminName = localStorage.getItem('adminName') || 'Admin';
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  // ✅ fermer seulement si clic hors navbar
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {

    const clickedInside = this.eRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.showMenu = false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminName');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.showMenu = false;
  }

  editProfile() {
    this.router.navigate(['/profil']);
    this.showMenu = false;
  }
}