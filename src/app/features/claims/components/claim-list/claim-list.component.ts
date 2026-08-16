import {
  ChangeDetectionStrategy,
  Component,
  input
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Claim } from '../../models/claim.model';

@Component({
  selector: 'app-claim-list',
  imports: [CurrencyPipe],
  templateUrl: './claim-list.component.html',
  styleUrl: './claim-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClaimListComponent {
  readonly claims = input.required<Claim[]>();
}
