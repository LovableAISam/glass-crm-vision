import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiEmailContent } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface EmailContentTypeData extends ResponseData {
  name: string;
}

export interface EmailContentData extends ResponseData {
  subject: string;
  content: string;
  createdBy: string;
  transactionType: EmailContentTypeData | null;
}

interface EmailContentListResponse extends ResultData<EmailContentData[]> {}

export interface EmailContentListRequest extends DefaultQueryPageRequest {
  search?: string;
  sortOrder?: 'ASC' | 'DESC';
}

function useEmailContentListFetcher(baseUrl: string, payload: EmailContentListRequest) {
  return apiGet<EmailContentListResponse>({
    baseUrl,
    path: `${apiEmailContent}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useEmailContentListFetcher;
