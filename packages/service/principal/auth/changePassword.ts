import { DefaultRequest } from '@woi/core/api';
import { apiPassword } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPut from '@woi/common/api/apiPut';

export type ChangePasswordResponse = {}

export type ChangePasswordRequest = DefaultRequest & {
  newPassword: string;
  password: string;
}

function useChangePasswordFetcher(baseUrl: string, payload: ChangePasswordRequest) {
  return apiPut<ChangePasswordResponse>({
    baseUrl,
    path: `${apiPassword}`,
    payload,
  });
}

export default useChangePasswordFetcher;
