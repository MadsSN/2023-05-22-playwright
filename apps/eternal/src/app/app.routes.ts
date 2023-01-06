import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Routes,
} from '@angular/router';
import { UserLoaderGuard } from './services/user-loader.guard';
import { HomeComponent } from './home.component';
import { Configuration } from '@eternal/shared/config';
import { inject } from '@angular/core';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [
      UserLoaderGuard,
      (route: ActivatedRouteSnapshot) => {
        if (route.queryParamMap.has('disable-testid')) {
          inject(Configuration).useTestid = false;
        }
        return true;
      },
    ],
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'customers',
        loadChildren: () => import('@eternal/customers/feature'),
      },
      {
        path: 'bookings',
        loadChildren: () => import('@eternal/bookings'),
      },
      {
        path: 'holidays',
        loadChildren: () => import('@eternal/holidays/feature'),
      },
      {
        path: 'diary',
        loadChildren: () => import('@eternal/diary/feature'),
      },
    ],
  },
];
