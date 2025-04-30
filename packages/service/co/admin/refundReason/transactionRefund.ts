import { apiTransactionRefund } from '@woi/common/meta/apiPaths/coApiPaths';
import apiPost from '@woi/common/api/apiPost';

export interface TransactionRefundResponse {
  failure: boolean;
  transactionId: string;
  referenceNumber: string;
  responseCode: string;
  description: string;
  responseMessage: string;
  message: string;
  errorCode: string;
}

export interface TransactionRefundRequest {
  inputReason: string;
  password: string;
  referenceNumber: string;
  refundReason: string;
  transactionId: string;
}

function useTransactionRefundFetcher(
  baseUrl: string,
  payload: TransactionRefundRequest,
) {
  return apiPost<TransactionRefundResponse>({
    baseUrl,
    path: `${apiTransactionRefund}`,
    payload,
  });
}

export default useTransactionRefundFetcher;
