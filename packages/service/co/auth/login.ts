import { constructUrlSearchParams, DefaultRequest } from '@woi/core/api';
import { apiAuth } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export type LoginResponse = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  jti: string;
}

export type LoginRequest = DefaultRequest & {
  grant_type: 'password';
  username: string;
  password: string;
}

function useLoginFetcher(baseUrl: string, payload: LoginRequest) {
  return apiPost<LoginResponse>({
    baseUrl,
    path: `${apiAuth}`,
    payload: constructUrlSearchParams(payload),
  });
}

export default useLoginFetcher;
