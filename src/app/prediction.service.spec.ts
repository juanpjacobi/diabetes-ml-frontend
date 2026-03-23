import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PredictionService, PredictionRequest, PredictionResponse } from './prediction.service';
import { environment } from '../environments/environment';

const mockRequest: PredictionRequest = {
  Gender: 1,
  AGE: 50,
  Urea: 4.7,
  Cr: 46,
  HbA1c: 4.9,
  Chol: 4.2,
  TG: 0.9,
  HDL: 2.4,
  LDL: 1.4,
  VLDL: 0.5,
  BMI: 24.0,
};

describe('PredictionService', () => {
  let service: PredictionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PredictionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should POST to the correct URL', () => {
    service.predict(mockRequest).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/predict`);
    expect(req.request.method).toBe('POST');
    req.flush({ predicted_class: 0, label: 'No diabético' });
  });

  it('should send the request body as-is', () => {
    service.predict(mockRequest).subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/predict`);
    expect(req.request.body).toEqual(mockRequest);
    req.flush({ predicted_class: 0, label: 'No diabético' });
  });

  it('should return the prediction response', () => {
    const mockResponse: PredictionResponse = { predicted_class: 2, label: 'Diabético' };
    let result: PredictionResponse | undefined;

    service.predict(mockRequest).subscribe(res => (result = res));
    httpMock.expectOne(`${environment.apiUrl}/predict`).flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });
});
