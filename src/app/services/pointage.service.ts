import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PointageService {

  private BASE_URL = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  getPointage(
    userId: string,
    filters: { year?: number | null; month?: number | null; day?: number | null }
  ) {
    const params = new URLSearchParams();

    if (filters.year !== null && filters.year !== undefined && filters.year !== 0) {
      params.set('year', String(filters.year));
    }

    if (filters.month !== null && filters.month !== undefined && filters.month !== 0) {
      params.set('month', String(filters.month));
    }

    if (filters.day !== null && filters.day !== undefined && filters.day !== 0) {
      params.set('day', String(filters.day));
    }

    const query = params.toString();
    const url = query
      ? `${this.BASE_URL}/pointage/${userId}?${query}`
      : `${this.BASE_URL}/pointage/${userId}`;

    return this.http.get(url);
  }
}