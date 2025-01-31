import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import { apiMerchantList } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MerchantDataList extends ResponseData {
  merchantCode: string,
  merchantCompleteName: string,
  balance: number,
  status: boolean | string,
  effectiveDateFrom: string,
  effectiveDateTo: string,
  merchantCategoryCode: string,
  merchantId: string,
}

interface ResultData<T> {
  merchantList: T;
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

interface MerchantListResponse extends ResultData<MerchantDataList[]> { }

export interface MerchantListRequest extends DefaultQueryPageRequest {
  effectiveDateFrom?: string;
  effectiveDateTo?: string;
  merchantCode?: string;
  merchantCompleteName?: string;
  status?: boolean | '';
  pageNumber?: number;
  pageSize?: number;
}

function useMerchantDetailFetcher(baseUrl: string, payload: MerchantListRequest) {
  return apiGet<MerchantListResponse>({
    baseUrl,
    path: `${apiMerchantList}`,
    config: { params: constructUrlSearchParams(payload) },
  });
}

export default useMerchantDetailFetcher;
