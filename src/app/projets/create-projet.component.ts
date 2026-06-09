import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-projet',
  templateUrl: './create-projet.component.html',
  styleUrls: ['./create-projet.component.css']
})
export class CreateProjetComponent implements OnInit {

  users: any[] = [];

  projectId: string | null = null;
  isEditMode = false;

  newProjet = {
    nom_projet: '',
    description: '',
    statut: '',
    date_debut: '',
    date_fin: '',
    membres: [] as string[]
  };

  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

  // users
  this.userService.getUsers().subscribe(users => {
    this.users = users;
  });

  // GET ID REACTIF (IMPORTANT FIX)
  this.route.paramMap.subscribe(params => {

    this.projectId = params.get('id');

    if (this.projectId) {
      this.isEditMode = true;

      this.http.get<any>(`http://localhost:8000/projects/${this.projectId}`)
        .subscribe({
          next: (project) => {

            console.log("PROJECT LOADED =", project); // 🔥 DEBUG IMPORTANT

            this.newProjet = {
              nom_projet: project.nom_projet || '',
              description: project.description || '',
              statut: project.statut || '',
              date_debut: project.date_debut?.substring(0,10) || '',
              date_fin: project.date_fin?.substring(0,10) || '',
              membres: project.membres || []
            };
          },
          error: (err) => {
            console.error("GET PROJECT ERROR =", err);
          }
        });
    }
  });
}

  // ================= CREATE =================
  addProjet() {
    this.http.post('http://localhost:8000/projects/', this.newProjet)
      .subscribe({
        next: () => this.router.navigate(['/projets']),
        error: (err) => console.error("Erreur création projet", err)
      });
  }

  // ================= UPDATE =================
  updateProjet() {
    if (!this.projectId) return;

    this.http.put(
      `http://localhost:8000/projects/${this.projectId}`,
      this.newProjet
    ).subscribe({
      next: () => this.router.navigate(['/projets']),
      error: (err) => console.error("Erreur update projet", err)
    });
  }

  // ================= MAIN HANDLER =================
  submitProjet() {
    if (this.isEditMode) {
      this.updateProjet();
    } else {
      this.addProjet();
    }
  }

  // ================= NAVIGATION =================
  retour() {
    this.router.navigate(['/projets']);
  }

  annuler() {
    this.router.navigate(['/projets']);
  }
}