import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-capture-utilisateurs',
  templateUrl: './capture-utilisateurs.component.html',
  styleUrls: ['./capture-utilisateurs.component.css']
})
export class CaptureUtilisateursComponent implements OnInit {
  logs: any[] = [];
  loading = false;
  error = '';
  page = 1;
  pageSize = 50;
  total = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchPaginatedLogs();
  }

  fetchPaginatedLogs(page: number = this.page) {
    this.loading = true;
    this.http.get<any>(`http://localhost:8000/activity_logs/paginated?page=${page}&page_size=${this.pageSize}`).subscribe({
      next: (data) => {
        this.logs = data.logs || data.results || [];
        this.page = data.page;
        this.pageSize = data.page_size;
        this.total = data.total;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des logs';
        this.loading = false;
      }
    });
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.fetchPaginatedLogs(newPage);
  }

  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }
}
