import { DefaultRequest } from '@woi/core/api';
import { apiPasswordVerification } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export type PasswordVerificationResponse = {}

export type PasswordVerificationRequest = DefaultRequest & {
  password: string;
  token: string;
}

function usePasswordVerificationFetcher(baseUrl: string, payload: PasswordVerificationRequest) {
  return apiPost<PasswordVerificationResponse>({
    baseUrl,
    path: `${apiPasswordVerification}`,
    payload,
  });
}

export default usePasswordVerificationFetcher;
