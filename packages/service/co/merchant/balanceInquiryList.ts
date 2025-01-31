import {
  DefaultQueryPageRequest,
  PaginationData,
  constructUrlSearchParams,
} from '@woi/core/api';
import { apiMerchantBalanceInquiry } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface BalanceInquiryData {
  coCode: string;
  coName: string;
  balance: number;
  lastUpdate: string;
}

export interface BalanceInquiryHeader {
  accountNumber: string;
  balanceNett: number;
  balanceGross: number;
  inquiryTime: string;
}

export interface BalanceInquiryRequest extends DefaultQueryPageRequest {
  'End Date'?: string;
  'Start Date'?: string;
  'merchant code': string;
}

export interface BalanceInquiryResponse extends PaginationData {
  accountNumber: string;
  balance: number;
  date: string;
  balanceInquiryList: BalanceInquiryData[];
  balanceInquiryHeader: BalanceInquiryHeader;
}

function useBalanceInquiryFetcher(
  baseUrl: string,
  payload: BalanceInquiryRequest,
) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== '' && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<BalanceInquiryResponse>({
    baseUrl,
    path: `${apiMerchantBalanceInquiry}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useBalanceInquiryFetcher;
