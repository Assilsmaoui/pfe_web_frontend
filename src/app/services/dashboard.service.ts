import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  // =========================
  // 📊 STATS GLOBALES
  // =========================
  getStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/stats`);
  }

  // =========================
  // 🏆 TOP USERS
  // =========================
  getTopUsers(limit: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/top-users?limit=${limit}`);
  }

  // =========================
  // 📱 APPS LES PLUS UTILISÉES
  // =========================
  getMostUsedApps(limit: number = 5): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/most-used-apps?limit=${limit}`);
  }

  // =========================
  // 👤 TEMPS PAR UTILISATEUR / MOIS
  // =========================
  getMonthlyUserTime(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/user/${userId}/monthly`);
  }

  // =========================
  // ⚡ WEBSOCKET (REAL TIME DASHBOARD)
  // =========================
  connectDashboardSocket(callback: (data: any) => void): WebSocket {

    const socket = new WebSocket('ws://localhost:8000/dashboard/ws');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    socket.onclose = () => {
      console.log('WebSocket fermé');
    };

    return socket;
  }
}