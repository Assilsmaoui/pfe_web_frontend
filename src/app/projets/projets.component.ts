// ...existing code...
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ProjetsComponent implements OnInit {
    getUsernameById(id: string | undefined): string {
      if (!id) return '';
      const user = this.users?.find((u: any) => u._id === id);
      return user ? user.username : id;
    }
  @ViewChild('listeProjets') listeProjets!: ElementRef;
  projets: any[] = [];
  showAddForm = false;
  users: any[] = [];
  newProjet = {
    nom_projet: '',
    description: '',
    statut: '',
    date_debut: '',
    date_fin: '',
    membres: [] as string[]
  };

  constructor(private http: HttpClient, private userService: UserService) {}

  ngOnInit(): void {
    this.getProjets();
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  getProjets() {
    this.http.get<any[]>('http://localhost:8000/projects/').subscribe(data => {
      this.projets = data;
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addProjet() {
    this.http.post('http://localhost:8000/projects/', this.newProjet).subscribe(() => {
      this.getProjets();
      this.newProjet = {
        nom_projet: '',
        description: '',
        statut: '',
        date_debut: '',
        date_fin: '',
        membres: []
      };
      this.showAddForm = false;
      setTimeout(() => {
        if (this.listeProjets) {
          this.listeProjets.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 200);
    });
  }
}
