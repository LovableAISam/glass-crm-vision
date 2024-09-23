import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiCountry } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface CountryData extends ResponseData {
  name: string;
}

interface CountryListResponse extends ResultData<CountryData[]> {}

export interface CountryListRequest extends DefaultQueryPageRequest {
  search?: string;
}

function useCountryListFetcher(baseUrl: string, payload: CountryListRequest) {
  return apiGet<CountryListResponse>({
    baseUrl,
    path: `${apiCountry}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useCountryListFetcher;
