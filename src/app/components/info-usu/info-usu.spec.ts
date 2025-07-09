import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUsu } from './info-usu';

describe('InfoUsu', () => {
  let component: InfoUsu;
  let fixture: ComponentFixture<InfoUsu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoUsu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoUsu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
