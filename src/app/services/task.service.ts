import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskService {

  private apiUrl = 'http://localhost:8000/tasks/';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(task: Task): Observable<any> {
    return this.http.post(this.apiUrl, task);
  }

  getPaginatedTasks(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(
      `http://localhost:8000/tasks/paginated?page=${page}&page_size=${pageSize}`
    );
  }

  // ================= GET BY ID =================
  getTaskById(taskId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}${taskId}`);
  }

  // ================= UPDATE =================
  updateTask(taskId: string, task: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}${taskId}`, task);
  }

  // ================= DELETE =================
  deleteTask(taskId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}${taskId}`);
  }
}