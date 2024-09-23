import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiCurrency } from '@woi/common/meta/apiPaths/principalApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface CurrencyData extends ResponseData {
  name: string;
  code: string;
}

interface CurrencyListResponse extends ResultData<CurrencyData[]> {}

export interface CurrencyListRequest extends DefaultQueryPageRequest {
  search?: string;
}

function useCurrencyListFetcher(baseUrl: string, payload: CurrencyListRequest) {
  return apiGet<CurrencyListResponse>({
    baseUrl,
    path: `${apiCurrency}`,
    config: { params: constructUrlSearchParams(payload)},
  });
}

export default useCurrencyListFetcher;
