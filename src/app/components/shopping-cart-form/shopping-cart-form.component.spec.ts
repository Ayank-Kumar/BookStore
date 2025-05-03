import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartFormComponent } from './shopping-cart-form.component';

describe('ShoppingCartFormComponent', () => {
  let component: ShoppingCartFormComponent;
  let fixture: ComponentFixture<ShoppingCartFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShoppingCartFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingCartFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
