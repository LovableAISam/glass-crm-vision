import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiEmailContent } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface EmailContentUpdateResponse extends ResponseData {}

export interface EmailContentUpdateRequest extends DefaultRequest {
  id: number | string;
  subject: string;
  content: string;
  transactionTypeId: number | string | null;
}

function useEmailContentUpdateFetcher(baseUrl: string, id: number | string, payload: EmailContentUpdateRequest) {
  return apiPut<EmailContentUpdateResponse>({
    baseUrl,
    path: `${apiEmailContent}/${id}`,
    payload,
  });
}

export default useEmailContentUpdateFetcher;
