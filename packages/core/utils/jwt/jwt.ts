import { ckAccessToken } from "@woi/common/meta/cookieKeys";
import jwt_decode from "jwt-decode";
import Cookie from "../Cookie";

export interface JWTData {
  aud: string[];
  user_name: string;
  scope: string[];
  exp: number;
  authorities: string[];
  jti: string;
  client_id: string;
}

export const isExpiredToken = (exp: number) => {
  return Date.now() >= exp * 1000;
};

export const getJwtData = (token: string) => {
  return jwt_decode<JWTData>(token);
};

export const getToken = () => {
  const accessToken = Cookie.get(ckAccessToken);
  return accessToken;
};

export const getTokenData = () => {
  const token = getToken();
  if (!token) return;
  return getJwtData(token);
};

export default {
  getToken,
  getTokenData,
  getJwtData,
  isExpiredToken,
};