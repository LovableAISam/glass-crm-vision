import { apiMerchantCashoutPayment } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface CashoutPaymentResponse {
  accountName: string;
  accountNumber: string;
  amount: number;
  amountAfterFee: number;
  bankName: string;
  date: string;
  description: string;
  fee: number;
  refNum: string;
  source: string;
  status: string;
  transactionId: string;
  transactionStatus: string;
  transferService: string;
}

export interface CashoutPaymentRequest {
  accountName: string;
  accountNumber: string;
  amount: number;
  bankCode: string;
  bankId: string;
  bankName: string;
  description: string;
  merchantCode: string;
  methodTransferCode: string;
}

function useMerchantCashoutPaymentFetcher(
  baseUrl: string,
  payload: CashoutPaymentRequest,
) {
  return apiPost<CashoutPaymentResponse>({
    baseUrl,
    path: `${apiMerchantCashoutPayment}`,
    payload,
  });
}

export default useMerchantCashoutPaymentFetcher;
