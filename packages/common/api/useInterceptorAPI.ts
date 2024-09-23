import { AxiosStatic } from 'axios';
import Cookie from '@woi/core/utils/Cookie';
import { apiAuth, apiPasswordReset, apiPasswordVerification } from '@woi/common/meta/apiPaths/principalApiPaths';
import { apiAppCustomization } from '@woi/common/meta/apiPaths/coApiPaths';
import useRefreshTokenFetcher from './refreshToken';
import { ckRefreshToken, ckAccessToken, ckLocale } from '../meta/cookieKeys';

const unprotectedAPI = [apiAuth, apiPasswordReset, apiPasswordVerification, apiAppCustomization];

function useInterceptorAPI(axios: AxiosStatic, baseUrl: string) {

  axios.interceptors.request.use(
    (config) => {
      const token = Cookie.get(ckAccessToken);
      const locale = Cookie.get(ckLocale);
      if (token && !unprotectedAPI.some(api => config.url?.includes(api))) {
        config = {
          ...config,
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept-Language': locale ? locale.toUpperCase() : 'EN',
          },
        };
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (!originalConfig.url.includes(apiAuth) && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            const response = await useRefreshTokenFetcher(baseUrl, {
              client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
              client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
              grant_type: 'refresh_token',
              refresh_token: Cookie.get(ckRefreshToken) || ''
            });
            const { result, error } = response;
            if (result && !error) {
              Cookie.set(ckAccessToken, result.access_token);
            }

            return axios(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        } else if (err.response.status === 401) {
          Cookie.remove(ckAccessToken);
        }
      }
      return Promise.reject(err);
    }
  );

  return axios;
}

export default useInterceptorAPI;