import { DefaultRequest, ResponseData } from '@woi/core/api';
import { apiSMSContent } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface SMSContentCreateResponse extends ResponseData {}

export interface SMSContentCreateRequest extends DefaultRequest {
  subject: string;
  content: string;
  transactionTypeId: number | string | null;
}

function useSMSContentCreateFetcher(baseUrl: string, payload: SMSContentCreateRequest) {
  return apiPost<SMSContentCreateResponse>({
    baseUrl,
    path: `${apiSMSContent}`,
    payload,
  });
}

export default useSMSContentCreateFetcher;
