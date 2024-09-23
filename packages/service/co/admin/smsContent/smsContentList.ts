import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiSMSContent } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface SMSContentTypeData extends ResponseData {
  name: string;
  createdBy: string;
}

export interface SMSContentData extends ResponseData {
  subject: string;
  content: string;
  createdBy: string;
  transactionType: SMSContentTypeData;
}

interface SMSContentListResponse extends ResultData<SMSContentData[]> {}

export interface SMSContentListRequest extends DefaultQueryPageRequest {
  search?: string;
}

function useSMSContentListFetcher(baseUrl: string, payload: SMSContentListRequest) {
  return apiGet<SMSContentListResponse>({
    baseUrl,
    path: `${apiSMSContent}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useSMSContentListFetcher;
