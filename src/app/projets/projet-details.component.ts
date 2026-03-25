import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-projet-details',
  templateUrl: './projet-details.component.html',
  styleUrls: ['./projet-details.component.css']
})
export class ProjetDetailsComponent implements OnInit {
  projectId: string = '';
  tasks: any[] = [];
  users: any[] = [];
  nomProjet: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    if (this.projectId) {
      // Récupère les tâches du projet
      this.http.get<any[]>(`http://localhost:8000/tasks/project/${this.projectId}`).subscribe(data => {
        this.tasks = data;
      });
      // Récupère le nom du projet
      this.http.get<any>(`http://localhost:8000/projects/${this.projectId}`).subscribe(projet => {
        this.nomProjet = projet.nom_projet || '';
      });
    }
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  getUsernameById(id: string | undefined): string {
    if (!id) return '';
    const user = this.users?.find((u: any) => u._id === id);
    return user ? user.username : id;
  }

  retour() {
    this.router.navigate(['/projets']);
  }
}
