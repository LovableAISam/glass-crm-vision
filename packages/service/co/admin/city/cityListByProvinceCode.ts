import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiCityByCode } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface CityData {
  code: string;
  name: string;
}

function useCityListByProvinceCodeFetcher(baseUrl: string, provinceCode: string) {
  return apiGet<CityData[]>({
    baseUrl,
    path: `${apiCityByCode}/${provinceCode}`,
  });
}

export default useCityListByProvinceCodeFetcher;
