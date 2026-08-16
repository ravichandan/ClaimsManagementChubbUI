import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { ClaimFormComponent } from '../../components/claim-form/claim-form.component';
import { ClaimListComponent } from '../../components/claim-list/claim-list.component';
import { NewClaim } from '../../models/claim.model';
import { ClaimService } from '../../services/claim.service';

@Component({
  selector: 'app-claims-page',
  imports: [ClaimFormComponent, ClaimListComponent],
  templateUrl: './claims-page.component.html',
  styleUrl: './claims-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimsPageComponent {
  private readonly claimService = inject(ClaimService);
  readonly claims = this.claimService.claims;
  readonly isLoading = this.claimService.isLoading;
  readonly errorMessage = this.claimService.errorMessage;
  readonly claimsUnderReview = computed(
    () => this.claims().filter((claim) => claim.status === 'Under review').length
  );
  readonly confirmationMessage = signal('');

  submitClaim(claim: NewClaim): void {
    this.confirmationMessage.set('');
    this.claimService.addClaim(claim).subscribe((createdClaim) => {
      this.confirmationMessage.set(`${createdClaim.id} has been submitted and is ready for review.`);
    });
  }

  retryLoadingClaims(): void {
    this.claimService.loadClaims();
  }
}
