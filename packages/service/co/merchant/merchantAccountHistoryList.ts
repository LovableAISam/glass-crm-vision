import {
  constructUrlSearchParams,
  DefaultQueryPageRequest,
  ResponseData,
} from '@woi/core/api';
import { apiMerchantAccountHistory } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MerchantAccountHistory extends ResponseData {
  amount: number;
  balance: number;
  coCode: string;
  coDestination: string;
  coSource: string;
  createdBy: string;
  createdDate: string;
  currency: string;
  date: string;
  debitCredit: string;
  fee: number;
  id: string;
  issuer: string;
  mdr: number;
  merchantCode: string;
  modifiedBy: string;
  modifiedDate: string;
  phoneNumber: string;
  qrType: string;
  rrn: string;
  status: string;
  tips: number;
  transactionType: string;
  transactionTypeDesc: string;
  vaDestination: string;
  vaSource: string;
  //Additional BI Snap
  destination: string;
  coFee: number;
  feeChargedMember: number;
  feeChargedMerchant: number;
  totalAmount: number;
  balanceGross: number;
  balanceNett: number;
  referenceNumber: string;
  partnerReferenceNumber: string;
}

interface ResultData {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  merchantFuntionId: string;
  data: MerchantAccountHistory[];
}

interface TransactionSummaryResponse extends ResultData { }

export interface MerchantAccountHistoryRequest extends DefaultQueryPageRequest {
  'co code'?: string;
  'merchant code'?: string;
  'debit credit'?: string[];
  'Start Date'?: string;
  'End Date'?: string;
  qrType?: string;
  'qris type'?: string[];
}

function useMerchantAccountHistoryFetcher(
  baseUrl: string,
  payload: MerchantAccountHistoryRequest,
) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== '' && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<TransactionSummaryResponse>({
    baseUrl,
    path: `${apiMerchantAccountHistory}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useMerchantAccountHistoryFetcher;
