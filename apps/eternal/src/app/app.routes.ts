import { Routes } from '@angular/router';
import { UserLoaderGuard } from './services/user-loader.guard';
import { HomeComponent } from './home.component';

export const appRoutes: Routes = [
  {
    path: '',
    canActivate: [UserLoaderGuard],
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
