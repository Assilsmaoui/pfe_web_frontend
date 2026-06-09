import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../services/user.service';
import { ProjectService } from '../services/project.service'; // ⭐ AJOUT

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
  showDeletePopup = false;
taskToDeleteId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private projectService: ProjectService // ⭐ AJOUT
  ) {}

  ngOnInit(): void {

    this.projectId = this.route.snapshot.paramMap.get('id') || '';

    if (this.projectId) {

      // ================= TASKS =================
      this.http.get<any[]>(
        `http://localhost:8000/tasks/project/${this.projectId}`
      ).subscribe(data => {
        this.tasks = data;
      });

      // ================= PROJECT (GET BY ID via SERVICE) =================
      this.projectService.getProjectById(this.projectId).subscribe(projet => {
        this.nomProjet = projet.nom_projet || '';
      });
    }

    // ================= USERS =================
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  // ================= UTILS =================
  getUsernameById(id: string | undefined): string {
    if (!id) return '';
    const user = this.users?.find((u: any) => u._id === id);
    return user ? user.username : id;
  }

  // ================= NAV =================
  retour() {
    this.router.navigate(['/projets']);
  }
  deleteTask(taskId: string) {
  this.http.delete(`http://localhost:8000/tasks/${taskId}`)
    .subscribe(() => {
      this.tasks = this.tasks.filter(t => t._id !== taskId);
    });
}
editTask(task: any) {
  this.router.navigate(['/tasks', task._id, 'edit']);
}
confirmDelete(taskId: string) {
  this.taskToDeleteId = taskId;
  this.showDeletePopup = true;
}
cancelDelete() {
  this.taskToDeleteId = null;
  this.showDeletePopup = false;
}
deleteTaskConfirmed() {
  if (!this.taskToDeleteId) return;

  this.http.delete(`http://localhost:8000/tasks/${this.taskToDeleteId}`)
    .subscribe(() => {

      this.tasks = this.tasks.filter(t => t._id !== this.taskToDeleteId);

      this.cancelDelete();
    });
}
}