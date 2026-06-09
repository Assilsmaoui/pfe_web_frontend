import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PointageService } from '../services/pointage.service';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {

  userId: string = '';
  data: any[] = [];

  selectedYear: number | null = new Date().getFullYear();
  selectedMonth: number | null = new Date().getMonth() + 1;
  selectedDay: number | null = new Date().getDate();

  years: number[] = [];
  months = [
    { value: 1, label: 'Janvier' },
    { value: 2, label: 'Février' },
    { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' },
    { value: 8, label: 'Août' },
    { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' },
    { value: 11, label: 'Novembre' },
    { value: 12, label: 'Décembre' }
  ];

  days: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pointageService: PointageService
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;

    this.initYears();
    this.updateDays();
    this.loadPointage();
  }

  initYears() {
    const currentYear = new Date().getFullYear();
    for (let year = 1989; year <= currentYear; year++) {
      this.years.push(year);
    }
  }

  updateDays() {
    if (this.selectedYear && this.selectedMonth) {
      const dayCount = new Date(this.selectedYear, this.selectedMonth, 0).getDate();
      this.days = Array.from({ length: dayCount }, (_, index) => index + 1);

      if (this.selectedDay && this.selectedDay > dayCount) {
        this.selectedDay = null;
      }
      return;
    }

    this.days = Array.from({ length: 31 }, (_, index) => index + 1);
  }

  onYearChange() {
    this.updateDays();
  }

  onMonthChange() {
    this.updateDays();
  }

  onSearch() {
    this.loadPointage();
  }

  loadPointage() {
    this.pointageService
      .getPointage(this.userId, {
        year: this.selectedYear,
        month: this.selectedMonth,
        day: this.selectedDay
      })
      .subscribe(res => {
        this.data = res as any[];
      });
  }

  retour() {
    this.router.navigate(['/gestion-utilisateurs']);
  }

  // ✅ AJOUT IMPORTANT : conversion durée secondes → HH:MM:SS
  formatDuration(seconds: number): string {

    if (seconds === null || seconds === undefined) return "00:00:00";

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return (
      String(h).padStart(2, '0') + ':' +
      String(m).padStart(2, '0') + ':' +
      String(s).padStart(2, '0')
    );
  }
}