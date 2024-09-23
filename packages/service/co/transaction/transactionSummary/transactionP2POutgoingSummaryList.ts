import { constructUrlSearchParams, DefaultQueryPageRequest, ResponseData } from '@woi/core/api';
import { apiTransactionP2POutgoingSummary } from '@woi/common/meta/apiPaths/coApiPaths';
import apiGet from '@woi/common/api/apiGet';


export type UpgradeStatus = 'UPGRADE' | 'NOT_UPGRADE';

export type TransactionType =
  'P2P_OUTGOING_SEND_TO_BANK - BPI' |
  'P2P_OUTGOING_SEND_TO_BANK - IBFT';

export interface TransactionSummaryP2PData extends ResponseData {
  amount: number,
  bacnetIsorc: string,
  balance: number,
  billerFee: string,
  bnisorc: string,
  dateTime: string,
  description: string,
  destinationBIC: string,
  destinationBank: string,
  destinationName: string,
  feeTransaction: number,
  merchantName: string,
  orderId: string,
  paymentMethod: string,
  receiverNumber: string,
  referralNumber: string,
  rmNumber: string,
  secondaryIdentifier: string,
  senderNumber: string,
  status: string,
  totalAmount: number,
  traceNumber: string,
  transactionHistoryId: string,
  transactionMethod: string,
  transactionNumber: string,
  transactionType: string;
}
interface ResultData<T> {
  data: T;
  currentPage: number;
  totalPages: number;
  totalElements: number;
  transactions: TransactionSummaryP2PData[];
}

interface TransactionSummaryP2PResponse extends ResultData<TransactionSummaryP2PData[]> { }

export interface TransactionSummaryP2PRequest extends DefaultQueryPageRequest {
  endAt?: string;
  size?: number;
  startAt?: string;
  status?: string[];
  transactionType?: string[];
}

function useTransactionP2POutgoingSummaryFetcher(baseUrl: string, payload: TransactionSummaryP2PRequest) {
  const request: Record<string, any> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (value !== "" && value.length !== 0) {
      request[key] = value;
    }
  }

  return apiGet<TransactionSummaryP2PResponse>({
    baseUrl,
    path: `${apiTransactionP2POutgoingSummary}`,
    config: { params: constructUrlSearchParams(request) },
  });
}

export default useTransactionP2POutgoingSummaryFetcher;
