import { DefaultRequest } from '@woi/core/api';
import { apiPasswordReset } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export type ResetPasswordResponse = {
  max: boolean;
  numberOfAttempt: number;
  success: boolean;
  timeWindowSecond: number;
}

export type ResetPasswordRequest = DefaultRequest & {
  email: string;
}

function useResetPasswordFetcher(baseUrl: string, payload: ResetPasswordRequest) {
  return apiPost<ResetPasswordResponse>({
    baseUrl,
    path: `${apiPasswordReset}`,
    payload,
  });
}

export default useResetPasswordFetcher;
