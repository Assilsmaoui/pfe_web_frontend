import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserActivityDetailService } from '../services/user-activity-detail.service';

@Component({
  selector: 'app-user-activity-detail',
  templateUrl: './user-activity-detail.component.html'
})
export class UserActivityDetailComponent implements OnInit {

  taskId: string = '';
  logs: any[] = [];
  selectedType: string = 'periodic';

  constructor(
    private route: ActivatedRoute,
    private activityService: UserActivityDetailService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.taskId = params.get('id') || '';
      this.loadData();
    });
  }

  loadData(): void {
    if (!this.taskId) return;

    this.activityService.getTaskActivity(this.taskId, this.selectedType)
      .subscribe({
        next: (res: any) => {
          this.logs = Array.isArray(res) ? res : (res.logs || res.data || []);
        },
        error: (err) => {
          console.error(err);
          this.logs = [];
        }
      });
  }

  setType(type: string): void {
    this.selectedType = type;
    this.loadData();
  }

  goBack(): void {
    this.location.back();
  }

  // ✅ AJOUT IMPORTANT : conversion secondes → HH:MM:SS
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