import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiContentManagement } from "@woi/common/meta/apiPaths/principalApiPaths";
import apiGet from '@woi/common/api/apiGet';

export interface ContentData extends ResponseData {
  name: string;
  createdDate: string;
  content: string;
  id: string;
  modifiedDate: string;
}

interface ContentListResponse extends ResultData<ContentData[]> { }

export interface ContentListRequest extends DefaultQueryPageRequest {
  search?: string;
  page?: number;
  sort?: string;
  contentName?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
}

function useContentListFetcher(baseUrl: string, payload: ContentListRequest) {
  return apiGet<ContentListResponse>({
    baseUrl,
    path: `${apiContentManagement}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useContentListFetcher;
