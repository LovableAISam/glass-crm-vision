import { constructUrlSearchParams, DefaultRequest } from '@woi/core/api';
import { apiAuth } from '../meta/apiPaths/principalApiPaths';
import apiPost from './apiPost';

interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  jti: string;
}

interface RefreshTokenRequest extends DefaultRequest {
  grant_type: 'refresh_token';
  refresh_token: string;
}

function useRefreshTokenFetcher(baseUrl: string, payload: RefreshTokenRequest) {
  return apiPost<RefreshTokenResponse>({
    baseUrl,
    path: `${apiAuth}`,
    payload: constructUrlSearchParams(payload),
  });
}

export default useRefreshTokenFetcher;
