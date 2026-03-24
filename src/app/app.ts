import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PredictionService, PredictionResponse, MetricsResponse } from './prediction.service';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private fb = inject(FormBuilder);
  private predictionService = inject(PredictionService);

  result  = signal<PredictionResponse | null>(null);
  loading = signal(false);
  error   = signal<string | null>(null);
  metrics = signal<MetricsResponse | null>(null);

  form = this.fb.group({
    Gender: [null as number | null, [Validators.required]],
    AGE:   [null as number | null, [Validators.required, Validators.min(1),   Validators.max(120)]],
    Urea:  [null as number | null, [Validators.required, Validators.min(0.5), Validators.max(200)]],
    Cr:    [null as number | null, [Validators.required, Validators.min(0.1), Validators.max(50)]],
    HbA1c: [null as number | null, [Validators.required, Validators.min(2.0), Validators.max(20)]],
    Chol:  [null as number | null, [Validators.required, Validators.min(1.0), Validators.max(20)]],
    TG:    [null as number | null, [Validators.required, Validators.min(0.1), Validators.max(30)]],
    HDL:   [null as number | null, [Validators.required, Validators.min(0.1), Validators.max(10)]],
    LDL:   [null as number | null, [Validators.required, Validators.min(0.1), Validators.max(15)]],
    VLDL:  [null as number | null, [Validators.required, Validators.min(0.1), Validators.max(10)]],
    BMI:   [null as number | null, [Validators.required, Validators.min(10),  Validators.max(80)]],
  });

  ngOnInit(): void {
    this.loadMetrics();
  }

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
        this.loadMetrics();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 422 && err.error?.detail?.length) {
          const detail = err.error.detail[0];
          const field = detail.loc?.[1] ?? 'campo desconocido';
          this.error.set(`Valor fuera de rango en "${field}": ${detail.msg}`);
        } else if (err.status === 0) {
          this.error.set('No se pudo conectar con la API. Verifica que el servidor esté activo.');
        } else {
          this.error.set(`Error del servidor (${err.status}). Intenta nuevamente.`);
        }
        this.loading.set(false);
      },
    });
  }

  onReset(): void {
    this.form.reset();
    this.result.set(null);
    this.error.set(null);
  }

  private loadMetrics(): void {
    this.predictionService.getMetrics().subscribe({
      next: (m) => this.metrics.set(m),
      error: () => {},
    });
  }
}