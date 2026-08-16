import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { NewClaim } from '../../models/claim.model';

@Component({
  selector: 'app-claim-form',
  imports: [ReactiveFormsModule],
  templateUrl: './claim-form.component.html',
  styleUrl: './claim-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  readonly claimSubmitted = output<NewClaim>();

  readonly claimForm = this.formBuilder.nonNullable.group({
    claimantName: ['', [Validators.required, Validators.minLength(2)]],
    claimantEmail: ['', [Validators.required, Validators.email]],
    claimType: ['Vehicle' as const, Validators.required],
    incidentDate: ['', Validators.required],
    location: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.required, Validators.minLength(20)]]
  });

  submitClaim(): void {
    if (this.claimForm.invalid) {
      this.claimForm.markAllAsTouched();
      return;
    }

    this.claimSubmitted.emit(this.claimForm.getRawValue());
    this.claimForm.reset({
      claimantName: '',
      claimantEmail: '',
      claimType: 'Vehicle',
      incidentDate: '',
      location: '',
      amount: 0,
      description: ''
    });
  }
}
