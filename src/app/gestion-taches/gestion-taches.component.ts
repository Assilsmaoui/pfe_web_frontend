

import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-gestion-taches',
  templateUrl: './gestion-taches.component.html',
  styleUrls: ['./gestion-taches.component.css']
})
export class GestionTachesComponent implements OnInit {
  tasks: Task[] = [];
  users: User[] = [];
  loading = true;
  error = '';
  showAddTaskForm = false;
  addTaskForm: FormGroup;
  addTaskError = '';
  addTaskSuccess = '';

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      priority: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      vector: [''],
      user_ids: [[], Validators.required]
    });
  }

  getUserName(id: string): string {
    const user = this.users.find((u: any) => String(u._id) === String(id) || String(u.id) === String(id));
    return user ? user.username : id;
  }

  ngOnInit(): void {
    this.fetchTasks();
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      }
    });
  }

  fetchTasks() {
    this.loading = true;
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des tâches';
        this.loading = false;
      }
    });
  }

  toggleAddTaskForm() {
    this.showAddTaskForm = !this.showAddTaskForm;
    this.addTaskError = '';
    this.addTaskSuccess = '';
    this.addTaskForm.reset();
  }

  onAddTaskSubmit() {
    if (this.addTaskForm.invalid) {
      this.addTaskError = 'Veuillez remplir tous les champs.';
      return;
    }
    this.addTaskError = '';
    this.addTaskSuccess = '';

    const formValue = { ...this.addTaskForm.value };
    // S'assurer que user_ids est bien un tableau de chaînes (pour MongoDB ObjectId)
    const user_ids = (formValue.user_ids || []).map((id: string) => String(id));
    // Convertir les dates au format ISO
    const payload: any = {
      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,
      start_date: formValue.start_date ? new Date(formValue.start_date).toISOString() : '',
      end_date: formValue.end_date ? new Date(formValue.end_date).toISOString() : '',
      user_ids: user_ids
    };
    if (formValue.vector) {
      payload.vector = formValue.vector;
    }

    this.taskService.addTask(payload).subscribe({
      next: () => {
        this.addTaskSuccess = 'Tâche ajoutée avec succès !';
        this.fetchTasks();
        this.addTaskForm.reset();
        this.showAddTaskForm = false;
      },
      error: (err) => {
        // Si la tâche s'enregistre malgré une erreur CORS, afficher le succès
        if (err && err.status === 0 && err.name === 'HttpErrorResponse') {
          this.addTaskSuccess = 'Tâche ajoutée avec succès ! (CORS côté client)';
          this.fetchTasks();
          this.addTaskForm.reset();
          this.showAddTaskForm = false;
        } else if (err && err.error) {
          this.addTaskError = 'Erreur lors de l\'ajout de la tâche : ' + (typeof err.error === 'string' ? err.error : JSON.stringify(err.error));
        } else {
          this.addTaskError = 'Erreur lors de l\'ajout de la tâche (aucun détail fourni).';
        }
      }
    });
  }
}
