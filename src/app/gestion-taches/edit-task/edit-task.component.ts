import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css']
})
export class EditTaskComponent implements OnInit {

  taskId: string | null = null;

  task: any = {
    title: '',
    description: '',
    project_id: '',
    user_ids: [],
    start_date: '',
    end_date: '',
    priority: 'Moyenne'
  };

  showError = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  // ================= GET BY ID =================
  ngOnInit(): void {

    this.taskId = this.route.snapshot.paramMap.get('taskId');
    if (!this.taskId) return;

    this.taskService.getTaskById(this.taskId).subscribe({
      next: (data) => {

        this.task = {
          title: data.title,
          description: data.description,

          // 🔥 IMPORTANT FIX
          project_id: data.project_id || '',

          user_ids: Array.isArray(data.user_ids)
            ? data.user_ids.map((u: any) => String(u))
            : [],

          start_date: data.start_date ? data.start_date.substring(0, 16) : '',
          end_date: data.end_date ? data.end_date.substring(0, 16) : '',
          priority: data.priority || 'Moyenne'
        };
      },
      error: () => {
        this.showError = true;
        this.errorMessage = 'Erreur lors du chargement de la tâche';
      }
    });
  }

  // ================= UPDATE =================
  updateTask(): void {

    if (!this.taskId) return;

    const payload = {
      title: this.task.title,
      description: this.task.description,

      // 🔥 IMPORTANT FIX (NE JAMAIS ENVOYER NULL)
      project_id: this.task.project_id || '',

      user_ids: this.task.user_ids,

      start_date: this.task.start_date,
      end_date: this.task.end_date,
      priority: this.task.priority
    };

    console.log('PAYLOAD UPDATE:', payload);

    this.taskService.updateTask(this.taskId, payload).subscribe({
      next: () => {
  this.router.navigate(['/gestion-taches']);
},
      error: (err) => {
        console.log('ERREUR COMPLETE :', err);
        console.log('DETAIL BACKEND :', err.error);
        console.log('DETAIL VALIDATION :', err.error?.detail);

        this.showError = true;
        this.errorMessage = 'Erreur lors de la mise à jour';
      }
    });
  }

  // ================= CANCEL =================
  cancel(): void {
    this.router.navigate(['/gestion-taches']);
  }
}