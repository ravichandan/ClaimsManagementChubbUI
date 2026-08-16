import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';

import { Claim, NewClaim } from '../models/claim.model';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/claims';
  private readonly claimsState = signal<Claim[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorMessageState = signal('');

  readonly claims = this.claimsState.asReadonly();
  readonly isLoading = this.loadingState.asReadonly();
  readonly errorMessage = this.errorMessageState.asReadonly();

  constructor() {
    this.loadClaims();
  }

  loadClaims(): void {
    this.loadingState.set(true);
    this.errorMessageState.set('');

    this.http
      .get<Claim[]>(this.apiUrl)
      .pipe(
        tap((claims) => this.claimsState.set(claims)),
        catchError((error: HttpErrorResponse) => {
          this.setErrorMessage(error);
          return of([]);
        }),
        finalize(() => this.loadingState.set(false))
      )
      .subscribe();
  }

  addClaim(claim: NewClaim): Observable<Claim> {
    this.loadingState.set(true);
    this.errorMessageState.set('');

    return this.http.post<Claim>(this.apiUrl, claim).pipe(
      tap((createdClaim) => this.claimsState.update((claims) => [createdClaim, ...claims])),
      catchError((error: HttpErrorResponse) => {
        this.setErrorMessage(error);
        return throwError(() => error);
      }),
      finalize(() => this.loadingState.set(false))
    );
  }

  private setErrorMessage(error: HttpErrorResponse): void {
    if (error.status === 0) {
      this.errorMessageState.set('The claims service is unavailable. Check that the backend is running.');
      return;
    }

    this.errorMessageState.set(`The claims service returned an error (${error.status}). Please try again.`);
  }
}
