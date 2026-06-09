import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserActivityDetailService {
  private apiUrl = 'http://localhost:8000/activity_logs/by-task';

  constructor(private http: HttpClient) {}

  getTaskActivity(taskId: string, type: string = ''): Observable<any> {
    const queryParams = new URLSearchParams({ task_id: taskId });

    if (type) {
      queryParams.set('type', type);
    }

    return this.http.get<any>(`${this.apiUrl}?${queryParams.toString()}`);
  }
}