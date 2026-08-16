import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'claims' },
	{
		path: 'claims',
		loadComponent: () =>
			import('./features/claims/pages/claims-page/claims-page.component').then(
				(module) => module.ClaimsPageComponent
			)
	},
	{
		path: 'workload',
		loadComponent: () =>
			import('./features/workload/pages/workload-page/workload-page.component').then(
				(module) => module.WorkloadPageComponent
			)
	},
	{ path: '**', redirectTo: 'claims' }
];
