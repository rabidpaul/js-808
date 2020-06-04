import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TracksEditorComponent } from './tracks-editor.component';

describe('TracksEditorComponent', () => {
  let component: TracksEditorComponent;
  let fixture: ComponentFixture<TracksEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TracksEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
