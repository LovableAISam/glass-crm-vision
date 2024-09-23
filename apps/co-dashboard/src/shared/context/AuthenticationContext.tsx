import React from 'react';
import { Cookie } from '@woi/core';
import { ckAccessToken, ckRefreshToken } from '@woi/common/meta/cookieKeys';

export interface AuthenticationData {
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

const Authentication = React.createContext<AuthenticationData>(null!);
const AuthenticationDispatch = React.createContext<
  React.Dispatch<AuthenticationAction>
>(null!);

type AuthenticationAction =
  | {
      type: 'do-login';
      payload: {
        accessToken: string;
        refreshToken: string;
      };
    }
  | {
      type: 'do-logout';
    };

function specReducer(
  state: AuthenticationData,
  action: AuthenticationAction,
): AuthenticationData {
  switch (action.type) {
    case 'do-login':
      Cookie.set(ckAccessToken, action.payload.accessToken);
      Cookie.set(ckRefreshToken, action.payload.refreshToken);
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case 'do-logout':
      Cookie.remove(ckAccessToken);
      Cookie.remove(ckRefreshToken);
      return {
        ...state,
        isLoggedIn: false,
      };
    default:
      return state;
  }
}

const initialState: AuthenticationData = {
  isLoggedIn: false,
  accessToken: null,
  refreshToken: null,
};

export function AuthenticationProvider(
  props: React.PropsWithChildren<{
    accessToken: AuthenticationData['accessToken'];
    refreshToken: AuthenticationData['refreshToken'];
  }>,
) {
  const [spec, dispatch] = React.useReducer(specReducer, {
    ...initialState,
    accessToken: props.accessToken,
    refreshToken: props.refreshToken,
    isLoggedIn: Boolean(props.accessToken),
  });

  return (
    <Authentication.Provider value={spec}>
      <AuthenticationDispatch.Provider value={dispatch}>
        {props.children}
      </AuthenticationDispatch.Provider>
    </Authentication.Provider>
  );
}

export function useAuthenticationSpec() {
  return React.useContext(Authentication);
}

export function useAuthenticationSpecDispatch() {
  return React.useContext(AuthenticationDispatch);
}
