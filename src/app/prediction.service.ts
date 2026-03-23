import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface PredictionRequest {
  Gender: number;
  AGE: number;
  Urea: number;
  Cr: number;
  HbA1c: number;
  Chol: number;
  TG: number;
  HDL: number;
  LDL: number;
  VLDL: number;
  BMI: number;
}

export interface PredictionResponse {
  predicted_class: number;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class PredictionService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/predict`;

  predict(data: PredictionRequest): Observable<PredictionResponse> {
    return this.http.post<PredictionResponse>(this.apiUrl, data);
  }
}