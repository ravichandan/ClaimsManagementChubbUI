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
	{ path: '**', redirectTo: 'claims' }
];
