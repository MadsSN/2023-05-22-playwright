import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import { userLoaded, signInUser, signOutUser } from './security.actions';
import { ANONYMOUS_USER, User } from './security.reducer';
import { AuthService } from '@auth0/auth0-angular';

@Injectable()
export class SecurityEffects {
  user$ = createEffect(() =>
    this.authService.user$.pipe(
      map((user) =>
        userLoaded({
          user: user
            ? {
                id: user.email || '',
                email: user.email || '',
                name: user.name || '',
                anonymous: false,
              }
            : ANONYMOUS_USER,
        })
      )
    )
  );

  signInUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signInUser),
        tap(() => this.authService.loginWithRedirect())
      ),
    { dispatch: false }
  );

  signOutUser$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(signOutUser),
        tap(() => this.authService.logout())
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}
}
