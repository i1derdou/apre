import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessDialogComponent } from './success-dialog.component';

describe('SuccessDialogComponent', () => {
  let component: SuccessDialogComponent;
  let fixture: ComponentFixture<SuccessDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the default header and message', () => {
    const compiled = fixture.nativeElement;
    const headerElement = compiled.querySelector('.success-dialog__title');
    const messageElement = compiled.querySelector('.success-dialog__message');

    expect(headerElement.textContent).toBe('Congratulations!');
    expect(messageElement.textContent).toBe('Your action has succeeded!');
  });

  it('should display the custom header and message', () => {
    component.header = 'Custom Header';
    component.message = 'Custom Message';
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const headerElement = compiled.querySelector('.success-dialog__title');
    const messageElement = compiled.querySelector('.success-dialog__message');

    expect(headerElement.textContent).toBe('Custom Header');
    expect(messageElement.textContent).toBe('Custom Message');
  });

});
