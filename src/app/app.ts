import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PredictionService, PredictionResponse } from './prediction.service';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private fb = inject(FormBuilder);
  private predictionService = inject(PredictionService);

  result = signal<PredictionResponse | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    Gender: [null as number | null, [Validators.required]],
    AGE:   [null as number | null, [Validators.required, Validators.min(1), Validators.max(120)]],
    Urea:  [null as number | null, [Validators.required, Validators.min(0)]],
    Cr:    [null as number | null, [Validators.required, Validators.min(0)]],
    HbA1c: [null as number | null, [Validators.required, Validators.min(0)]],
    Chol:  [null as number | null, [Validators.required, Validators.min(0)]],
    TG:    [null as number | null, [Validators.required, Validators.min(0)]],
    HDL:   [null as number | null, [Validators.required, Validators.min(0)]],
    LDL:   [null as number | null, [Validators.required, Validators.min(0)]],
    VLDL:  [null as number | null, [Validators.required, Validators.min(0)]],
    BMI:   [null as number | null, [Validators.required, Validators.min(0)]],
  });

  get resultClass(): string {
    const r = this.result();
    if (!r) return '';
    return ['result--healthy', 'result--prediabetes', 'result--diabetic'][r.predicted_class] ?? '';
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    this.result.set(null);

    this.predictionService.predict(this.form.value as any).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo conectar con la API. Verifica que el servidor esté activo.');
        this.loading.set(false);
      },
    });
  }

  onReset(): void {
    this.form.reset();
    this.result.set(null);
    this.error.set(null);
  }
}