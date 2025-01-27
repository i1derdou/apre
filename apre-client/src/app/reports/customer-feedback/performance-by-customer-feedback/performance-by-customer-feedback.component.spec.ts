import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { PerformanceByCustomerFeedbackComponent } from './performance-by-customer-feedback.component';
import { environment } from '../../../../environments/environment';

describe('PerformanceByCustomerFeedbackComponent', () => {
  let component: PerformanceByCustomerFeedbackComponent;
  let fixture: ComponentFixture<PerformanceByCustomerFeedbackComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceByCustomerFeedbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerformanceByCustomerFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch and process report data correctly', () => {
    const mockResponse = [
      { agentId: 1, agentName: 'John Doe', totalRating: 100, averageRating: 4.5, feedbackCount: 20 },
      { agentId: 2, agentName: 'Jane Smith', totalRating: 80, averageRating: 4.0, feedbackCount: 15 },
    ];

    component.fetchReportData();
    const req = httpMock.expectOne(`${environment.apiBaseUrl}/reports/customer-feedback/performance-by-customer-feedback`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    expect(component.reportData).toEqual([
      { 'Agent ID': 1, 'Agent Name': 'John Doe', 'Total Rating': 100, 'Average Rating': 4.5, 'Feedback Count': 20 },
      { 'Agent ID': 2, 'Agent Name': 'Jane Smith', 'Total Rating': 80, 'Average Rating': 4.0, 'Feedback Count': 15 },
    ]);
  });

  it('should display "No feedback data available" when no data is present', () => {
    component.reportData = [];
    fixture.detectChanges();

    const noDataMessage = fixture.nativeElement.querySelector('p');
    expect(noDataMessage).toBeTruthy();
    expect(noDataMessage.textContent).toContain('No feedback data available');
  });
});
