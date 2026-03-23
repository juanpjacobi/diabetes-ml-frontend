import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { App } from './app';
import { PredictionResponse } from './prediction.service';

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let app: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(app).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(app.form.invalid).toBeTrue();
  });

  it('resultClass returns empty string when no result', () => {
    expect(app.resultClass).toBe('');
  });

  it('resultClass returns result--healthy for predicted_class 0', () => {
    app.result.set({ predicted_class: 0, label: 'No diabético' } as PredictionResponse);
    expect(app.resultClass).toBe('result--healthy');
  });

  it('resultClass returns result--prediabetes for predicted_class 1', () => {
    app.result.set({ predicted_class: 1, label: 'Predicción de diabetes' } as PredictionResponse);
    expect(app.resultClass).toBe('result--prediabetes');
  });

  it('resultClass returns result--diabetic for predicted_class 2', () => {
    app.result.set({ predicted_class: 2, label: 'Diabético' } as PredictionResponse);
    expect(app.resultClass).toBe('result--diabetic');
  });

  it('onReset clears result and error', () => {
    app.result.set({ predicted_class: 0, label: 'No diabético' } as PredictionResponse);
    app.error.set('some error');
    app.onReset();
    expect(app.result()).toBeNull();
    expect(app.error()).toBeNull();
  });
});
