import { constructUrlSearchParams, ResponseData } from '@woi/core/api';
import { apiMerchantTransactionHistoryDetail } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';

export interface MerchantTransactionDetailData extends ResponseData {
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


  acquirerName: string;
  customerPan: string;
  date: string;
  membersPhoneNo: string;
  merchantPan: string;
  merchantPhoneNo: string;
  paymentMethod: string;
  qrisMerchantLocation: string;
  referralNumber: string;
  terminalId: string;
  transactionNumber: string;
  merchantLongName: string;
  transactionAmount: number;
  debitCredit: string;
  balance: number;
}

export interface MerchantTransactionDetailListRequest {
  id: string;
}

function useMerchantTransactionHistoryDetailFetcher(baseUrl: string, payload: MerchantTransactionDetailListRequest) {
  return apiGet<MerchantTransactionDetailData>({
    baseUrl,
    path: `${apiMerchantTransactionHistoryDetail}`,
    config: { params: constructUrlSearchParams(payload.id) },
  });
}

export default useMerchantTransactionHistoryDetailFetcher;
