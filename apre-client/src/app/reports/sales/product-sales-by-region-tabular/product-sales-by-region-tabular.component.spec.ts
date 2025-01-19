import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductSalesByRegionTabularComponent } from './product-sales-by-region-tabular.component';

describe('SalesByRegionTabularComponent', () => {
  let component: ProductSalesByRegionTabularComponent;
  let fixture: ComponentFixture<ProductSalesByRegionTabularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProductSalesByRegionTabularComponent] // Import SalesByRegionTabularComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductSalesByRegionTabularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Product Sales by Region - Tabular"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Product Sales by Region - Tabular');
  });

  it('should initialize the regionForm with a null value', () => {
    const regionControl = component.regionForm.controls['region'];
    expect(regionControl.value).toBeNull();
    expect(regionControl.valid).toBeFalse();
  });

  it('should not submit the form if no region is selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.regionForm.valid).toBeFalse();
  });
});