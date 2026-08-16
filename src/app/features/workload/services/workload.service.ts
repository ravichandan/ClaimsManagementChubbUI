import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';

import {
  WorkloadSummary,
  WorkloadValidationError,
  validateWorkloadResponse
} from '../models/workload.model';

@Injectable({ providedIn: 'root' })
export class WorkloadService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/management/claims';
  private readonly workloadState = signal<WorkloadSummary | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorMessageState = signal('');

  readonly workload = this.workloadState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly errorMessage = this.errorMessageState.asReadonly();

  constructor() {
    this.loadWorkload();
  }

  loadWorkload(): void {
    this.loadingState.set(true);
    this.errorMessageState.set('');

    this.http
      .get<unknown>(this.apiUrl)
      .pipe(
        tap((response) => this.workloadState.set(validateWorkloadResponse(response).data)),
        catchError((error: HttpErrorResponse | WorkloadValidationError) => {
          this.setErrorMessage(error);
          return of(null);
        }),
        finalize(() => this.loadingState.set(false))
      )
      .subscribe();
  }

  private setErrorMessage(error: HttpErrorResponse | WorkloadValidationError): void {
    if (error instanceof WorkloadValidationError) {
      this.errorMessageState.set('The workload service returned data in an unexpected format.');
      return;
    }

    if (error.status === 0) {
      this.errorMessageState.set('The workload service is unavailable. Check that the backend is running.');
      return;
    }

    this.errorMessageState.set(`The workload service returned an error (${error.status}). Please try again.`);
  }
}
