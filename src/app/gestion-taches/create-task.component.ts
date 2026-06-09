import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements OnInit {
  users: User[] = [];
  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe({
      next: (data) => { this.users = data; }
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const title = (form.elements.namedItem('title') as HTMLInputElement)?.value.trim();
    const description = (form.elements.namedItem('description') as HTMLInputElement)?.value.trim();
    const priority = (form.elements.namedItem('priority') as HTMLSelectElement)?.value;
    const end_date = (form.elements.namedItem('deadline') as HTMLInputElement)?.value;
    const user_id = (form.elements.namedItem('assignedUser') as HTMLSelectElement)?.value;
    // Construction du payload Task
    const task: Task = {
      title: title || '',
      description: description || '',
      priority: priority || '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: end_date || '',
      user_ids: user_id ? [user_id] : []
    };
    this.taskService.addTask(task).subscribe({
      next: () => this.router.navigate(['/gestion-taches']),
      error: err => {
        let msg = 'Erreur lors de la création de la tâche : ';
        if (err?.error) {
          if (typeof err.error === 'string') {
            msg += err.error;
          } else if (err.error.detail) {
            msg += Array.isArray(err.error.detail)
              ? err.error.detail.join(', ')
              : err.error.detail;
          } else if (err.error.message) {
            msg += err.error.message;
          } else {
            msg += JSON.stringify(err.error);
          }
        } else {
          msg += err.statusText || 'Erreur inconnue';
        }
        alert(msg);
      }
    });
  }
}
