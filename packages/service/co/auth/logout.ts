import { DefaultRequest } from '@woi/core/api';
import { apiLogout } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export type LoginResponse = {
  message: string;
};

export type LoginRequest = DefaultRequest & {
  username: string;
};

function useLogoutFetcher(baseUrl: string, payload: LoginRequest) {
  return apiPost<LoginResponse>({
    baseUrl,
    path: `${apiLogout}`,
    payload: payload,
  });
}

export default useLogoutFetcher;
