import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiProvince } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface ProvinceData extends ResponseData {
  name: string;
}

export interface ProvinceListResponse extends ResultData<ProvinceData[]> {}

export interface ProvinceListRequest extends DefaultQueryPageRequest {
  search?: string;
  'country-id': string;
}

function useProvinceListFetcher(baseUrl: string, payload: ProvinceListRequest) {
  return apiGet<ProvinceListResponse>({
    baseUrl,
    path: `${apiProvince}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useProvinceListFetcher;
