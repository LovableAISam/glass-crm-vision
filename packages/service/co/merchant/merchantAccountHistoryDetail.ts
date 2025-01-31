import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import { apiMerchantAccountHistoryDetail } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface AccountHistoryDetailData extends ResponseData {
  acquirerName: string;
  amount: number;
  customerPan: string;
  date: string;
  mdr: number;
  membersPhoneNo: string;
  merchantPan: string;
  merchantPhoneNo: string;
  paymentMethod: string;
  qrisMerchantLocation: string;
  referralNumber: string;
  rrn: string;
  status: string;
  terminalId: string;
  tips: number;
  transactionNumber: string;
  transactionType: string;
  merchantLongName: string;
  transactionAmount: number;
  referenceNumber: string;
  feeChargedMember: number;
  feeChargedMerchant: number;
  debitCredit: string;
  totalAmount: number;
  balance: number;
  currency: string;
  partnerReferenceNumber: string;
}

interface ResultData {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  details: AccountHistoryDetailData[];
}

interface AccountHistoryDetailResponse extends ResultData { }

export interface AccountHistoryDetailRequest extends DefaultQueryPageRequest {
  id: string;
  debitCredit?: string[];
  'start-date'?: string;
  'end-date'?: string;
}

function useAccountHistoryDetailFetcher(baseUrl: string, payload: AccountHistoryDetailRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value?.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<AccountHistoryDetailResponse>({
    baseUrl,
    path: `${apiMerchantAccountHistoryDetail}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useAccountHistoryDetailFetcher;
