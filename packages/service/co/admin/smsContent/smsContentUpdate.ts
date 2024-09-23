import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiSMSContent } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPut from '@woi/common/api/apiPut';

export interface SMSContentUpdateResponse extends ResponseData {}

export interface SMSContentUpdateRequest extends DefaultRequest {
  id: number | string;
  subject: string;
  content: string;
  transactionTypeId: number | string | null;
}

function useSMSContentUpdateFetcher(baseUrl: string, id: number | string, payload: SMSContentUpdateRequest) {
  return apiPut<SMSContentUpdateResponse>({
    baseUrl,
    path: `${apiSMSContent}/${id}`,
    payload,
  });
}

export default useSMSContentUpdateFetcher;
