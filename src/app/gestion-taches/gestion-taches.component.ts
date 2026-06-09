import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  // Pagination
  page = 1;
  pageSize = 10;
  total = 0;

  // 🔥 DELETE POPUP
  showDeletePopup = false;
  taskToDelete: string | null = null;

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
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

  ngOnInit(): void {
    this.fetchPaginatedTasks();

    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      }
    });
  }

  // ================= USERS =================
  getUserName(id: string): string {
    const user = this.users.find(
      (u: any) =>
        String(u._id) === String(id) ||
        String(u.id) === String(id)
    );
    return user ? user.username : id;
  }

  getTaskId(task: Task): string | undefined {
    return task._id || (task as any).id;
  }

  // ================= TASKS =================
  fetchPaginatedTasks(page: number = this.page) {
    this.loading = true;

    this.taskService.getPaginatedTasks(page, this.pageSize).subscribe({
      next: (data) => {
        this.tasks = data.tasks;
        this.page = data.page;
        this.pageSize = data.page_size;
        this.total = data.total;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des tâches';
        this.loading = false;
      }
    });
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.fetchPaginatedTasks(newPage);
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  // ================= ADD TASK =================
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

    const formValue = { ...this.addTaskForm.value };

    const user_ids = (formValue.user_ids || []).map((id: string) => String(id));

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
        this.fetchPaginatedTasks(1);
        this.addTaskForm.reset();
        this.showAddTaskForm = false;
      },
      error: () => {
        this.addTaskError = 'Erreur lors de l\'ajout de la tâche';
      }
    });
  }

  // ================= EDIT =================
  editTask(task: any) {
    const taskId = task._id || task.id;
    this.router.navigate(['/gestion-tasks', taskId, 'edit']);
  }

  // ================= DELETE POPUP =================
  confirmDelete(taskId: string) {
    this.taskToDelete = taskId;
    this.showDeletePopup = true;
  }

  cancelDelete() {
    this.showDeletePopup = false;
    this.taskToDelete = null;
  }

  deleteTask() {
  if (!this.taskToDelete) return;

  this.taskService.deleteTask(this.taskToDelete).subscribe({
    next: () => {
      this.tasks = this.tasks.filter(t => t._id !== this.taskToDelete);
      this.cancelDelete();
    },
    error: (err) => {
      console.log('Erreur delete:', err);
      this.cancelDelete();
    }
  });
}
}