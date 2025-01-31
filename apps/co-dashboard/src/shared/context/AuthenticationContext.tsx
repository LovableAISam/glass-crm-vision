import React from 'react';
import { Cookie } from '@woi/core';
import {
  ckAccessToken,
  ckMerchantAccessToken,
  ckMerchantCode,
  ckMerchantRefreshToken,
  ckRefreshToken,
} from '@woi/common/meta/cookieKeys';

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
      isMerchant: boolean;
      merchantCode: string;
    };
  }
  | {
    type: 'do-logout';
    isMerchant: boolean;
  };

function specReducer(
  state: AuthenticationData,
  action: AuthenticationAction,
): AuthenticationData {
  switch (action.type) {
    case 'do-login':
      if (action.payload.isMerchant) {
        Cookie.set(ckMerchantAccessToken, action.payload.accessToken);
        Cookie.set(ckMerchantRefreshToken, action.payload.accessToken);
        Cookie.set(ckMerchantCode, action.payload.merchantCode);
      } else {
        Cookie.set(ckAccessToken, action.payload.accessToken);
        Cookie.set(ckRefreshToken, action.payload.accessToken);
      }
      return {
        ...state,
        isLoggedIn: true,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
      };
    case 'do-logout':
      if (action.isMerchant) {
        Cookie.remove(ckMerchantAccessToken);
        Cookie.remove(ckMerchantRefreshToken);
        Cookie.remove(ckMerchantCode);
      } else {
        Cookie.remove(ckAccessToken);
        Cookie.remove(ckRefreshToken);
      }
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
