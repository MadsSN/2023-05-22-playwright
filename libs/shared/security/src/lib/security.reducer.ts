import { createFeature, createReducer } from '@ngrx/store';
import { securityActions } from './security.actions';
import { immerOn } from 'ngrx-immer/store';

export interface User {
  id: string;
  email: string;
  name: string;
  anonymous: boolean;
}

export const ANONYMOUS_USER: User = {
  id: '',
  email: 'nomail',
  name: 'no user',
  anonymous: true,
};

export interface SecurityReducer {
  loaded: boolean;
  user: User | undefined;
}

const initialState: SecurityReducer = {
  loaded: false,
  user: undefined,
};

export const securityFeature = createFeature({
  name: 'security',
  reducer: createReducer<SecurityReducer>(
    initialState,
    immerOn(
      securityActions.loaded,
      securityActions.signInSuccess,
      (state, { user }) => {
        state.user = user;
        state.loaded = true;
      }
    ),
    immerOn(securityActions.signInSuccess, (state, { user }) => {
      state.user = user;
    })
  ),
});
