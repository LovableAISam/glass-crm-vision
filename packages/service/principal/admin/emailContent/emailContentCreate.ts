import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiEmailContent } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface EmailContentCreateResponse extends ResponseData {}

export interface EmailContentCreateRequest extends DefaultRequest {
  subject: string;
  content: string;
  transactionTypeId: number | string | null;
}

function useEmailContentCreateFetcher(baseUrl: string, payload: EmailContentCreateRequest) {
  return apiPost<EmailContentCreateResponse>({
    baseUrl,
    path: `${apiEmailContent}`,
    payload,
  });
}

export default useEmailContentCreateFetcher;
