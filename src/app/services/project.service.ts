import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectService {

  private baseUrl = 'http://localhost:8000/projects';

  constructor(private http: HttpClient) {}

  // ================= PAGINATION =================
  getPaginatedProjects(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/paginated?page=${page}&page_size=${pageSize}`
    );
  }

  // ================= CREATE =================
  addProject(project: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/`, project);
  }

  // ================= GET BY ID =================
  getProjectById(projectId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${projectId}`);
  }

  // ================= UPDATE =================
  updateProject(projectId: string, project: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${projectId}`, project);
  }

  // ================= DELETE =================
  deleteProject(projectId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${projectId}`);
  }
}