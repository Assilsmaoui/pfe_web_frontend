

   
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ajouter-taches',
  templateUrl: './ajouter-taches.component.html',
  styleUrls: ['./ajouter-taches.component.css']
})
export class AjouterTachesComponent implements OnInit {
  projectId: string = '';
  membresProjet: any[] = [];
  taches: any[] = [this.createEmptyTask()];
  nomProjet: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Réinitialise le tableau taches pour garantir que tous les champs sont présents
    this.taches = [this.createEmptyTask()];
    this.projectId = this.route.snapshot.paramMap.get('id') || '';
    // Appel direct à l'API des membres du projet
    this.http.get<any[]>(`http://localhost:8000/projects/${this.projectId}/members`).subscribe(membres => {
      this.membresProjet = membres;
    });
    // Récupère le nom du projet
    this.http.get<any>(`http://localhost:8000/projects/${this.projectId}`).subscribe(projet => {
      this.nomProjet = projet.nom_projet || '';
    });
  }

  createEmptyTask() {
    return {
      title: '',
      description: '',
      user_ids: [],
      start_date: '',
      end_date: '',
      priority: 'Moyenne'
    };
  }

  addTaskForm() {
    this.taches.push(this.createEmptyTask());
  }

  removeTaskForm(index: number) {
    if (this.taches.length > 1) {
      this.taches.splice(index, 1);
    }
  }

  submitTaches() {
    // Prépare chaque tâche pour l'API : user_ids doit être un tableau, et project_id doit être présent dans le body
    const tachesToSend = this.taches.map(t => ({
      ...t,
      user_ids: Array.isArray(t.user_ids) ? t.user_ids : [t.user_ids],
      project_id: this.projectId
    }));
    console.log('Tâches envoyées à l\'API:', tachesToSend);
    Promise.all(
      tachesToSend.map(tache =>
        this.http.post(`http://localhost:8000/tasks/project/${this.projectId}`, tache).toPromise()
      )
    ).then(() => {
      this.router.navigate(['/projets', this.projectId, 'details']);
    });
  }
   retour() {
      const pid = this.projectId || '';
      this.router.navigate([`/projets/${pid}/details`]);
    }
}
