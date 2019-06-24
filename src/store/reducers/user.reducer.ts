import { createReducer, on } from '@ngrx/store';

import { userState } from '../states/user.state';
import { login, logout } from '../actions/user.action';

export const userReducer = createReducer(userState,
  on(login, (state: any) => ({
    ...state,
    isLogin: true
  })),
  on(logout, (state: any) => ({
    ...state,
    isLogin: false
  }))
);
