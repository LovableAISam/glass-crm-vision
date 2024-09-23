import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData, ResultData } from '@woi/core/api';
import { apiMerchant } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MerchantDataResponse extends ResponseData {
  createdDate: string,
  modifiedDate: string,
  merchantCode: string,
  merchantName: string,
  balance: Number | null,
  status: boolean | '',
  effectiveDateFrom: string,
  effectiveDateTo: string,
  id: string;
}


interface MerchantListResponse extends ResultData<MerchantDataResponse[]> { }

export interface MerchantListRequest extends DefaultQueryPageRequest {
  effectiveDateFrom?: string;
  effectiveDateTo?: string;
  merchantName?: string;
  limit?: number;
  page?: number;
  status?: boolean | '';
  merchantCode?: string;
}

function useMerchantDetailFetcher(baseUrl: string, payload: MerchantListRequest) {
  return apiGet<MerchantListResponse>({
    baseUrl,
    path: `${apiMerchant}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useMerchantDetailFetcher;
