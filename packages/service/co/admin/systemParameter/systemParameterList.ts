import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiSystemParameter } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface SystemParameterData extends ResponseData {
  createdDate: string;
  modifiedDate: string;
  code: string;
  valueType: string;
  valueDate: string;
  valueText: string;
  id: string;
  description?: string;
}

interface SystemParameterListResponse extends ResultData<SystemParameterData[]> { }

export interface SystemParameterListRequest extends DefaultQueryPageRequest {
  limit?: number;
  page?: number;
  code?: string;
  sort?: string;
}

function useSystemParameterListFetcher(baseUrl: string, payload: SystemParameterListRequest) {
  return apiGet<SystemParameterListResponse>({
    baseUrl,
    path: `${apiSystemParameter}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useSystemParameterListFetcher;
