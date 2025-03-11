import {
  DefaultQueryPageRequest,
  ResponseData,
  ResultData,
} from '@woi/core/api';
import { apiMerchantCriteriaType } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MerchantCriteriaListTypeData extends ResponseData {
  code: string;
  id: string;
  definition: string;
}

interface MerchantCriteriaListResponse
  extends ResultData<MerchantCriteriaListTypeData[]> {}

export interface MerchantCriteriaListRequest extends DefaultQueryPageRequest {
  code?: string;
  id?: string;
}

function useMerchantCriteriaListFetcher(baseUrl: string) {
  return apiGet<MerchantCriteriaListResponse>({
    baseUrl,
    path: `${apiMerchantCriteriaType}`,
  });
}

export default useMerchantCriteriaListFetcher;
