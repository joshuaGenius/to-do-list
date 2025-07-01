import { Routes } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { authGuard  } from './auth.guard';

export const routes: Routes = [
{
    path: '',
    component: SigninComponent
  },
  {
    path: 'list',
     canActivate: [authGuard],
    loadComponent: () =>
      import('./list/list.component').then(m => m.ListComponent),
  
  }
];
