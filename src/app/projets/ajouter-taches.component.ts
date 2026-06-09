

   
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TaskService } from '../services/task.service';
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
  showErrorPopup = false;
  errorMessage = '';  
  taskId: string | null = null;
isEditMode = false;

  constructor(private route: ActivatedRoute, private http: HttpClient,
  private taskService: TaskService,private router: Router) {}

ngOnInit(): void {

  this.taches = [this.createEmptyTask()];

  this.projectId = this.route.snapshot.paramMap.get('id') || '';
  this.taskId = this.route.snapshot.paramMap.get('taskId');

  // ================= EDIT MODE =================
  if (this.taskId) {
    this.isEditMode = true;

    this.taskService.getTaskById(this.taskId).subscribe(task => {

      this.projectId = String(task.project_id);

      this.taches = [{
        title: task.title,
        description: task.description,

        // 🔥 IMPORTANT FIX FINAL
        user_ids: (task.user_ids || []).map((u: any) => String(u)),

        start_date: task.start_date,
        end_date: task.end_date,
        priority: task.priority || 'Moyenne'
      }];
    });
  }

  // ================= PROJECT DATA =================
  if (this.projectId) {

    this.http.get<any[]>(`http://localhost:8000/projects/${this.projectId}/members`)
      .subscribe(membres => {

        // 🔥 CRITICAL FIX
        this.membresProjet = membres.map(m => ({
          ...m,
          _id: String(m._id)
        }));
      });

    this.http.get<any>(`http://localhost:8000/projects/${this.projectId}`)
      .subscribe(projet => {
        this.nomProjet = projet.nom_projet || '';
      });
  }
}
createEmptyTask() {
  return {
    title: '',
    description: '',
    user_ids: [],
    start_date: '',
    end_date: '',
    priority: 'Moyenne',
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
  const normalize = (value: string) => {
  if (!value) return value;

  const [datePart, timePart] = value.split('T');

  const [y, mo, d] = datePart.split('-').map(Number);

  let h = 0;
  let m = 0;

  if (timePart) {
    const parts = timePart.split(':');
    h = Number(parts[0] ?? 0);
    m = Number(parts[1] ?? 0);
  }

  // FORCER UTC avec 00 si non choisi
  return new Date(Date.UTC(y, mo - 1, d, h, m, 0)).toISOString();
};
    // Pour chaque tâche, choisir l'endpoint selon la présence d'utilisateurs assignés
    for (let i = 0; i < this.taches.length; i++) {
    const t = this.taches[i];

    if (t.start_date && t.end_date) {
      if (t.end_date < t.start_date) {
        this.errorMessage = `Tâche #${i + 1}: La date de fin doit être supérieure à la date de début.`;
        this.showErrorPopup = true;
        return;
      }
    }
  }  if (this.isEditMode) {
    this.updateTask();
    return;
  }
    const requests = this.taches.map((tache, index) => {
      const taskNumber = index + 1;
      const hasManualUsers = Array.isArray(tache.user_ids) && tache.user_ids.length > 0;
      if (hasManualUsers) {
        // Affectation manuelle
        const tacheToSend = {
          ...tache,
          user_ids: tache.user_ids,
          project_id: this.projectId
        };
        return this.http
          .post(`http://localhost:8000/tasks/project/${this.projectId}`, tacheToSend)
          .toPromise()
          .then(() => ({ ok: true, taskNumber, hasManualUsers }))
          // .catch((error) => ({ ok: false, taskNumber, hasManualUsers, error }));
          .catch((error) => {
          const msg = this.extractErrorDetail(error);
          this.errorMessage = `Tâche #${taskNumber}: ${msg}`;
          this.showErrorPopup = true;

          return { ok: false, taskNumber, hasManualUsers, error };
        });
      } else {
        // Affectation automatique : envoyer user_ids vide et project_id dans le body
        const tacheAuto = {
          title: tache.title,
          description: tache.description,
          priority: tache.priority,
          start_date: tache.start_date,
          end_date: tache.end_date,
          user_ids: [],
          project_id: this.projectId
        };
        return this.http
          .post(`http://localhost:8000/tasks/auto_create/${this.projectId}`, tacheAuto)
          .toPromise()
          .then(() => ({ ok: true, taskNumber, hasManualUsers }))
          // .catch((error) => ({ ok: false, taskNumber, hasManualUsers, error }));
          .catch((error) => {
          const msg = this.extractErrorDetail(error);
          this.errorMessage = `Tâche #${taskNumber}: ${msg}`;
          this.showErrorPopup = true;

          return { ok: false, taskNumber, hasManualUsers, error };
        });
      }
    });

    Promise.all(requests).then((results: any[]) => {
      const failures = results.filter((result) => !result.ok);
      if (failures.length === 0) {
        this.router.navigate(['/projets', this.projectId, 'details']);
        return;
      }

      // alert(this.buildErrorsMessage(failures));
      this.errorMessage = this.buildErrorsMessage(failures);
      this.showErrorPopup = true;
    });
  }

  private buildErrorsMessage(failures: any[]): string {
    const autoFailedNumbers = failures
      .filter((failure) => !failure.hasManualUsers)
      .map((failure) => failure.taskNumber);

    const detailsByTask = failures
      .map((failure) => `Tâche #${failure.taskNumber}: ${this.extractErrorDetail(failure.error)}`)
      .join('\n');

    const parts: string[] = ['Erreur lors de la création des tâches.'];
    if (autoFailedNumbers.length > 0) {
      parts.push(`Affectation automatique échouée pour la/les tâche(s) n° ${autoFailedNumbers.join(', ')}.`);
    }
    parts.push(detailsByTask);

    return parts.join('\n');
  }
  closePopup() {
  this.showErrorPopup = false;
  this.errorMessage = '';
}

  private extractErrorDetail(error: any): string {
    if (!error) {
      return 'Erreur inconnue';
    }

    if (error?.error) {
      if (typeof error.error === 'string') {
        return error.error;
      }

      if (error.error.detail) {
        const detail = error.error.detail;
        if (Array.isArray(detail)) {
          return detail.join(', ');
        }
        return detail;
      }

      if (error.error.message) {
        return error.error.message;
      }

      return JSON.stringify(error.error);
    }

    return error.statusText || 'Erreur inconnue';
  }
retour() {
  const pid =
    this.projectId ||
    this.taches[0]?.project_id ||
    this.route.snapshot.paramMap.get('id') ||
    this.route.snapshot.paramMap.get('projectId');

  this.router.navigate(['/projets', pid, 'details']);
}


updateTask() {

  if (!this.taskId) return;

  const taskToUpdate = {
    ...this.taches[0],
    project_id: this.projectId
  };

  this.taskService.updateTask(this.taskId, taskToUpdate)
    .subscribe((res: any) => {

      // 🔥 récupère project_id depuis réponse backend
      const pid = res?.project_id || this.projectId;

      this.router.navigate(['/projets', pid, 'details']);
    });
}

}
