import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoadingInterceptor } from './loader/loading.interceptor';
import { importProvidersFrom } from '@angular/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

export const sharedUiMessagingProvider = [
  {
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: LoadingInterceptor,
  },
  importProvidersFrom(MatDialogModule),
];
