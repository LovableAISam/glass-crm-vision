import { ResponseData } from '@woi/core/api';
import { apiAllCountry } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface AllCountryData extends ResponseData {
  countryName: string;
  countryFlag: string;
  countryCode: string;
  internationalSubscriberDialingCode: string;
}

function useAllCountryListFetcher(baseUrl: string) {
  return apiGet<AllCountryData[]>({
    baseUrl,
    path: `${apiAllCountry}`,
  });
}

export default useAllCountryListFetcher;
