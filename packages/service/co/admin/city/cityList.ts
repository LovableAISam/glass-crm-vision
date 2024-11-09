import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiCity } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface CityData extends ResponseData {
  name: string;
}

export interface CityListResponse extends ResultData<CityData[]> {}

export interface CityListRequest extends DefaultQueryPageRequest {
  search?: string;
  'province-id': string;
}

function useCityListFetcher(baseUrl: string, payload: CityListRequest) {
  return apiGet<CityListResponse>({
    baseUrl,
    path: `${apiCity}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useCityListFetcher;
