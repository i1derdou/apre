/*
 * Author: David Clemens
 * Date: 2024-01-18
 * File: product-sales-by-region-tabular-components.spec.ts
 * Desc: Tests product sales by region component
*/

// Import statements
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

// Test suite
describe('AppComponent', () => {

  // Before each test
  beforeEach(async () => {
    // Configure the testing module with the router testing module and the app component
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppComponent]
    }).compileComponents();
  });

  // Test case to verify the app component was created
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
