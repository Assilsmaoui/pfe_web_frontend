import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8000/users';
  private paginatedUrl = 'http://localhost:8000/paginated';

  constructor(private http: HttpClient) {}


  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getPaginatedUsers(page: number = 1, pageSize: number = 10): Observable<any> {
    return this.http.get<any>(`${this.paginatedUrl}?page=${page}&page_size=${pageSize}`);
  }

  registerUser(user: any): Observable<any> {
    return this.http.post('http://localhost:8000/register', user);
  }
getUserById(userId: string): Observable<any> {
  return this.http.get(`http://localhost:8000/users/${userId}`);
}

updateUser(userId: string, user: any): Observable<any> {
  return this.http.put(`http://localhost:8000/users/${userId}`, user);
}

deleteUser(userId: string): Observable<any> {
  return this.http.delete(`http://localhost:8000/users/${userId}`);
}
}
