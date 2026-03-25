// ...existing code...
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-projet',
  templateUrl: './create-projet.component.html',
  styleUrls: ['./create-projet.component.css']
})
export class CreateProjetComponent implements OnInit {
  users: any[] = [];
  newProjet = {
    nom_projet: '',
    description: '',
    statut: '',
    date_debut: '',
    date_fin: '',
    membres: [] as string[]
  };

  constructor(private http: HttpClient, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  addProjet() {
    this.http.post('http://localhost:8000/projects/', this.newProjet).subscribe(() => {
      this.router.navigate(['/projets']);
    });
  }

  annuler() {
    this.router.navigate(['/projets']);
  }
}
