import { constructUrlSearchParams, DefaultQueryPageRequest, DefaultResponseTransactionsPagination, ResponseData } from '@woi/core/api';
import { apiMerchantTransactionHistory } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

interface HeaderMerchantTransactionHistory {
  endDate: string;
  inquiryTime: string;
  merchantCode: string;
  merchantName: string;
  startDate: string;
}

export interface MerchantTransactionHistoryData extends ResponseData {
  amount: number;
  balanceAfterTransaction: number;
  createdBy: string;
  createdDate: string;
  currency: string;
  description: string;
  destination: string;
  id: string;
  issuer: string;
  mdr: string;
  memberPhoneNumber: string;
  merchantCode: string;
  modifiedBy: string;
  modifiedDate: string;
  postDate: Date,
  qrType: string;
  rrn: string;
  status: string;
  tips: number;
  transactionCategory: string;
  transactionDate: string;
  transactionId: string;
  transactionType: string;

  // Yang Kurang Untuk Transaksi Merchant Account Binding
  coFee: number;
  feeChargedMember: number;
  feeChargedMerchant: number;
  totalAmount: number;
  balanceGross: number;
  balanceNett: number;
  dbCr: string;
  referenceNumber: string;
  partnerReferenceNumber: string;
}

interface TransactionHistoryListResponse extends DefaultResponseTransactionsPagination<MerchantTransactionHistoryData[]> {
  header: HeaderMerchantTransactionHistory;
}

export interface MerchantTransactionHistoryListRequest extends DefaultQueryPageRequest {
  'merchant code'?: string;
  'Start Date'?: string;
  'End Date'?: string;
}

function useMerchantTransactionHistoryListFetcher(baseUrl: string, payload: MerchantTransactionHistoryListRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<TransactionHistoryListResponse>({
    baseUrl,
    path: `${apiMerchantTransactionHistory}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useMerchantTransactionHistoryListFetcher;
