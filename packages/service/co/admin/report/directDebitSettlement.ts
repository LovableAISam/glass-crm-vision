import {
  constructUrlSearchParams,
  DefaultQueryPageRequest,
} from '@woi/core/api';
import { apiDirectDebitSettlementDetail } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface DirectDebitSettlementRequest extends DefaultQueryPageRequest {
  startAt?: string;
  endAt?: string;
  size?: number;
  sort?: string;
  merchantName?: string;
  status?: string[];
}

export interface DirectDebitSettlement {
  directDebitSettlementId: string;
  date: string;
  merchantCode: string;
  merchantName: string;
  grossTotalTransaction: string;
  feeChargedMember: number;
  feeChargedMerchant: string;
  coFeeTotal: number;
  nettMerchantBalance: number;
  status: string;
}

export interface ResponseDataDirectDebitSettlement {
  data: DirectDebitSettlement[];
  currentPage: number;
  totalElements: number;
  totalPages: number;
}

function useDirectDebitSettlementFetcher(
  baseUrl: string,
  payload: DirectDebitSettlementRequest,
) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== '' && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<ResponseDataDirectDebitSettlement>({
    baseUrl,
    path: `${apiDirectDebitSettlementDetail}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useDirectDebitSettlementFetcher;
