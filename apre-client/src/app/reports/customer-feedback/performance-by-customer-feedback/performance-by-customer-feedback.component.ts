import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { environment } from '../../../../environments/environment';
import { TableComponent } from './../../../shared/table/table.component';

@Component({
  selector: 'app-performance-by-customer-feedback',
  standalone: true,
  imports: [CommonModule, TableComponent], // Add CommonModule to imports
  template: `
    <h1>Performance By Customer Feedback</h1>
    <div class="region-container">
      <div class="card chart-card" *ngIf="reportData && reportData.length > 0; else noData">
        <app-table
          [title]="'Performance By Customer Feedback'"
          [data]="reportData"
          [headers]="['Agent ID', 'Agent Name', 'Total Rating', 'Average Rating', 'Feedback Count']"
          [sortableColumns]="['Agent Name', 'Total Rating']"
          [headerBackground]="'secondary'"
        ></app-table>
      </div>
      <ng-template #noData>
        <p>No feedback data available.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .region-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .form, .chart-card {
      width: 50%;
      margin: 20px 0;
      padding: 10px;
    }
    app-table {
      padding: 50px;
    }
  `]
})
export class PerformanceByCustomerFeedbackComponent implements OnInit {
  reportData: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchReportData();
  }

  fetchReportData(): void {
    this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/performance-by-customer-feedback`).subscribe({
      next: (data: any) => {
        this.reportData = data.map((item: any) => ({
          'Agent ID': item.agentId,
          'Agent Name': item.agentName,
          'Total Rating': item.totalRating,
          'Average Rating': item.averageRating,
          'Feedback Count': item.feedbackCount
        }));
        console.log('Report data:', this.reportData);
      },
      error: (err: any) => {
        console.error('Error fetching report data:', err);
      }
    });
  }
}