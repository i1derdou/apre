import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { environment } from '../../../../environments/environment';
import { TableComponent } from './../../../shared/table/table.component';

@Component({
  selector: 'app-customer-feedback-by-product',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <h1>Customer Feedback By Product</h1>
    <div class="region-container">
      <div class="card chart-card" *ngIf="reportData && reportData.length > 0; else noData">
        <app-table
          [title]="'Customer Feedback By Product'"
          [data]="reportData"
          [headers]="['Product', 'Average Rating', 'Feedback Count']"
          [sortableColumns]="['Product']"
          [headerBackground]="'secondary'"
        ></app-table>
      </div>
      <ng-template #noData>
        <p>No feedback data available.</p>
      </ng-template>
    </div>
  `,
  styles: `
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
  }`
})
export class CustomerFeedbackByProductComponent {

  reportData: any[] = [];

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
      this.fetchReportData();
    }

    fetchReportData(): void {
      this.http.get(`${environment.apiBaseUrl}/reports/customer-feedback/customer-feedback-by-product`).subscribe({
        next: (data: any) => {
          this.reportData = data.map((item: any) => ({
            'Product': item._id,
            'Average Rating': item.averageRating,
            'Feedback Count': item.totalFeedback
          }));
          console.log('Report data:', this.reportData);
        },
        error: (err: any) => {
          console.error('Error fetching report data:', err);
        }
      });
    }

}
