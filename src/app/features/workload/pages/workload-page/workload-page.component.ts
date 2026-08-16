import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { WorkloadService } from '../../services/workload.service';

@Component({
  selector: 'app-workload-page',
  imports: [CurrencyPipe, DecimalPipe],
  templateUrl: './workload-page.component.html',
  styleUrl: './workload-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkloadPageComponent {
  private readonly workloadService = inject(WorkloadService);

  readonly workload = this.workloadService.workload;
  readonly isLoading = this.workloadService.isLoading;
  readonly errorMessage = this.workloadService.errorMessage;

  retryLoadingWorkload(): void {
    this.workloadService.loadWorkload();
  }
}
